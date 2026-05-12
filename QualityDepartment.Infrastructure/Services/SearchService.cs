using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.Search;
using QualityDepartment.Core.Enums;
using QualityDepartment.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;

namespace QualityDepartment.Infrastructure.Services
{
    public class SearchService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;

        public SearchService(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<List<GlobalSearchResultDto>> SearchAsync(string searchTerm, string lang = "ua")
        {
            if (string.IsNullOrWhiteSpace(searchTerm)) return new List<GlobalSearchResultDto>();

            string cacheKey = $"search_{lang}_{searchTerm.Trim().ToLower()}";

            if (_cache.TryGetValue(cacheKey, out List<GlobalSearchResultDto>? cachedResults))
            {
                return cachedResults!;
            }

            var s = searchTerm.Trim();
            var now = DateTime.UtcNow;
            var results = new List<GlobalSearchResultDto>();

            var news = await _context.News
                .AsNoTracking()
                .Where(n => n.PublishDate <= now && (
                    EF.Functions.Like(n.TitleUa, $"%{s}%") || 
                    EF.Functions.Like(n.FullTextUa, $"%{s}%") ||
                    EF.Functions.Like(n.TitleEn, $"%{s}%") || 
                    EF.Functions.Like(n.FullTextEn, $"%{s}%") ||
                    n.Tags.Any(t => EF.Functions.Like(t.NameUa, $"%{s}%") || EF.Functions.Like(t.NameEn, $"%{s}%"))
                ))
                .OrderByDescending(n => n.PublishDate)
                .Select(n => new GlobalSearchResultDto
                {
                    Id = n.Id,
                    Type = SearchEntityType.News,
                    Title = lang == "en" ? n.TitleEn : n.TitleUa,
                    ShortDescription = lang == "en" ? n.FullTextEn : n.FullTextUa,
                    Link = $"/news/{n.Id}",
                    PublishDate = n.PublishDate
                }).Take(15).ToListAsync();

            var docs = await _context.Documents
                .AsNoTracking()
                .Where(d => d.PublishDate <= now && (
                    EF.Functions.Like(d.NameUa, $"%{s}%") || 
                    EF.Functions.Like(d.DescriptionUa, $"%{s}%") ||
                    EF.Functions.Like(d.NameEn, $"%{s}%") ||
                    EF.Functions.Like(d.DescriptionEn, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameUa, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameEn, $"%{s}%")
                ))
                .OrderByDescending(d => d.PublishDate)
                .Select(d => new GlobalSearchResultDto
                {
                    Id = d.Id,
                    Type = SearchEntityType.Document,
                    Title = lang == "en" ? d.NameEn : d.NameUa,
                    ShortDescription = lang == "en" ? d.DescriptionEn : d.DescriptionUa,
                    Link = $"/documents/{d.Id}/preview",
                    PublishDate = d.PublishDate
                }).Take(15).ToListAsync();

            var links = await _context.ExternalLinks
                .AsNoTracking()
                .Where(l => l.PublishDate <= now && (
                    EF.Functions.Like(l.NameUa, $"%{s}%") || 
                    EF.Functions.Like(l.ShortDescriptionUa, $"%{s}%") ||
                    EF.Functions.Like(l.NameEn, $"%{s}%") ||
                    EF.Functions.Like(l.ShortDescriptionEn, $"%{s}%")
                ))
                .OrderByDescending(l => l.PublishDate)
                .Select(l => new GlobalSearchResultDto
                {
                    Id = l.Id,
                    Type = SearchEntityType.ExternalLink,
                    Title = lang == "en" ? l.NameEn : l.NameUa,
                    ShortDescription = lang == "en" ? l.ShortDescriptionEn : l.ShortDescriptionUa,
                    Link = l.Url,
                    PublishDate = l.PublishDate
                }).Take(15).ToListAsync();

            var combined = news.Concat(docs).Concat(links)
                .OrderByDescending(x => x.PublishDate)
                .ToList();

            foreach (var item in combined)
            {
                item.ShortDescription = PrepareShortDescription(item.ShortDescription);
            }

            _cache.Set(cacheKey, combined, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
                SlidingExpiration = TimeSpan.FromMinutes(15)
            });

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