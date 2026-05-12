using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.Search;
using QualityDepartment.Core.Enums;
using QualityDepartment.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace QualityDepartment.Infrastructure.Services
{
    public class SearchService
    {
        private readonly ApplicationDbContext _context;

        public SearchService(ApplicationDbContext context) => _context = context;

        public async Task<List<GlobalSearchResultDto>> SearchAsync(string searchTerm, string lang = "ua")
        {
            if (string.IsNullOrWhiteSpace(searchTerm)) return new List<GlobalSearchResultDto>();

            var s = searchTerm.ToLower().Trim();
            var now = DateTime.UtcNow;

            var newsResults = await _context.News
                .AsNoTracking()
                .Include(n => n.Tags)
                .Where(n => n.PublishDate <= now && (
                    n.TitleUa.ToLower().Contains(s) || n.TitleEn.ToLower().Contains(s) ||
                    n.FullTextUa.ToLower().Contains(s) || n.FullTextEn.ToLower().Contains(s) ||
                    n.Tags.Any(t => t.NameUa.ToLower().Contains(s) || t.NameEn.ToLower().Contains(s))
                ))
                .Select(n => new GlobalSearchResultDto
                {
                    Id = n.Id,
                    Type = SearchEntityType.News,
                    Title = lang == "en" ? n.TitleEn : n.TitleUa,
                    ShortDescription = lang == "en" ? n.FullTextEn : n.FullTextUa,
                    Link = $"/news/{n.Id}"
                })
                .ToListAsync();

            var docResults = await _context.Documents
                .AsNoTracking()
                .Where(d => d.PublishDate <= now && (
                    d.NameUa.ToLower().Contains(s) || d.NameEn.ToLower().Contains(s) ||
                    d.DescriptionUa.ToLower().Contains(s) || d.DescriptionEn.ToLower().Contains(s)
                ))
                .Select(d => new GlobalSearchResultDto
                {
                    Id = d.Id,
                    Type = SearchEntityType.Document,
                    Title = lang == "en" ? d.NameEn : d.NameUa,
                    ShortDescription = lang == "en" ? d.DescriptionEn : d.DescriptionUa,
                    Link = $"/documents/{d.Id}"
                })
                .ToListAsync();

            var linkResults = await _context.ExternalLinks
                .AsNoTracking()
                .Where(l => l.PublishDate <= now && (
                    l.NameUa.ToLower().Contains(s) || l.NameEn.ToLower().Contains(s) ||
                    l.ShortDescriptionUa.ToLower().Contains(s) || l.ShortDescriptionEn.ToLower().Contains(s)
                ))
                .Select(l => new GlobalSearchResultDto
                {
                    Id = l.Id,
                    Type = SearchEntityType.ExternalLink,
                    Title = lang == "en" ? l.NameEn : l.NameUa,
                    ShortDescription = lang == "en" ? l.ShortDescriptionEn : l.ShortDescriptionUa,
                    Link = l.Url
                })
                .ToListAsync();

            var combined = newsResults.Concat(docResults).Concat(linkResults).ToList();

            foreach (var item in combined)
            {
                item.ShortDescription = PrepareShortDescription(item.ShortDescription);
            }

            return combined;
        }

        private string PrepareShortDescription(string? text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            var plainText = Regex.Replace(text, "<.*?>", string.Empty);
            return plainText.Length > 150 ? plainText.Substring(0, 147) + "..." : plainText;
        }
    }
}
