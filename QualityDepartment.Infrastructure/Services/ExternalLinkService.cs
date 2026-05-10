using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QualityDepartment.Core.DTOs.Admin.ExternalLinks;
using QualityDepartment.Core.DTOs.ExternalLinks;
using QualityDepartment.Core.Entities;
using QualityDepartment.Core.Mappings;
using QualityDepartment.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure.Services
{
    public class ExternalLinkService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly FileService _fileService;

        private const long MaxFileSizeBytes = 2 * 1024 * 1024; // 2MB
        private readonly string saveFolder = "links";
        private readonly string[] images = { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
        private readonly string[] mimeTypes = { "image/jpeg", "image/png", "image/webp", "image/svg+xml" };

        public ExternalLinkService(ApplicationDbContext context, IMapper mapper, FileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<List<ExternalLinkDto>> GetPublicLinksAsync(string lang = "ua")
        {
            var links = await _context.ExternalLinks
                .AsNoTracking()
                .Where(x => x.PublishDate <= DateTime.UtcNow)
                .OrderBy(x => x.SortOrder)
                .ToListAsync();

            return _mapper.Map<List<ExternalLinkDto>>(links, opt => opt.Items["lang"] = lang);
        }

        public async Task<(ExternalLinkDto? result, string? errorCode)> GetPublicByIdAsync(int id, string lang)
        {
            var link = await _context.ExternalLinks
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id && x.PublishDate <= DateTime.UtcNow);

            if (link == null) return (null, "LINK_NOT_FOUND_OR_NOT_PUBLISHED");

            return (_mapper.Map<ExternalLinkDto>(link, opt => opt.Items["lang"] = lang), null);
        }

        public async Task<(ExternalLinkAdminDetailsDto? result, string? errorCode)> GetAdminByIdAsync(int id)
        {
            var link = await _context.ExternalLinks
                .AsNoTracking()
                .Include(x => x.Creator)
                .Include(x => x.Editor)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (link == null) return (null, "LINK_NOT_FOUND");

            return (_mapper.Map<ExternalLinkAdminDetailsDto>(link), null);
        }

        public async Task<List<ExternalLinkAdminListItemDto>> GetAdminLinksAsync()
        {
            var links = await _context.ExternalLinks
                .AsNoTracking()
                .OrderBy(x => x.SortOrder)
                .ToListAsync();

            return _mapper.Map<List<ExternalLinkAdminListItemDto>>(links);
        }

        public async Task<(ExternalLinkAdminDetailsDto? result, string? errorCode)> CreateAsync(ExternalLinkCreateDto dto, int userId)
        {
            if (dto.Photo != null)
            {
                if (!_fileService.IsFileValid(dto.Photo, images, mimeTypes)) return (null, "INVALID_FILE_FORMAT");
                if (dto.Photo.Length > MaxFileSizeBytes) return (null, "FILE_TOO_LARGE");
            }

            if (await _context.ExternalLinks.AnyAsync(x => x.Url == dto.Url || x.NameUa == dto.NameUa))
                return (null, "LINK_OR_NAME_ALREADY_EXISTS");

            if (!IsValidUrl(dto.Url)) return (null, "INVALID_URL_FORMAT");

            var link = _mapper.Map<ExternalLink>(dto);

            var maxSort = await _context.ExternalLinks.MaxAsync(x => (int?)x.SortOrder) ?? 0;
            link.SortOrder = maxSort + 1;

            link.CreatedAt = DateTime.UtcNow;
            link.CreatorId = userId;

            if (dto.Photo != null)
                link.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);

            _context.ExternalLinks.Add(link);
            await _context.SaveChangesAsync();
            await _context.Entry(link).Reference(x => x.Creator).LoadAsync();

            return (_mapper.Map<ExternalLinkAdminDetailsDto>(link), null);
        }

        public async Task<(ExternalLinkAdminDetailsDto? result, bool success, string? errorCode)> UpdateAsync(int id, ExternalLinkUpdateDto dto, int userId)
        {
            var link = await _context.ExternalLinks.FindAsync(id);
            if (link == null) return (null, false, "LINK_NOT_FOUND");

            if (dto.Photo != null)
            {
                if (!_fileService.IsFileValid(dto.Photo, images, mimeTypes)) return (null, false, "INVALID_FILE_FORMAT");
                if (dto.Photo.Length > MaxFileSizeBytes) return (null, false, "FILE_TOO_LARGE");
            }

            if (await _context.ExternalLinks.AnyAsync(x => (x.Url == dto.Url || x.NameUa == dto.NameUa)
                && x.Id != id))
                return (null, false, "LINK_OR_NAME_ALREADY_EXISTS");

            if (!IsValidUrl(dto.Url)) return (null, false, "INVALID_URL_FORMAT");

            if (link.PublishDate <= DateTime.UtcNow)
                dto.PublishDate = link.PublishDate;

            _mapper.Map(dto, link);
            link.UpdatedAt = DateTime.UtcNow;
            link.EditorId = userId;

            if (dto.Photo != null)
            {
                _fileService.DeleteFile(link.PhotoPath);
                link.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);
            }
            else if (!dto.KeepOldPhoto)
            {
                _fileService.DeleteFile(link.PhotoPath);
                link.PhotoPath = null;
            }

            await _context.SaveChangesAsync();
            await _context.Entry(link).Reference(x => x.Editor).LoadAsync();
            return (_mapper.Map<ExternalLinkAdminDetailsDto>(link), true, null);
        }

        private bool IsValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }

        public async Task<(bool success, string? errorCode)> ReorderAsync(int id, int targetPosition)
        {
            var link = await _context.ExternalLinks.FindAsync(id);

            if (link == null) return (false, "LINK_NOT_FOUND");
            if (targetPosition < 1) return (false, "INVALID_POSITION");

            var allLinks = await _context.ExternalLinks.OrderBy(x => x.SortOrder).ToListAsync();
            allLinks.Remove(link);

            if (targetPosition > allLinks.Count)
                allLinks.Add(link);
            else
                allLinks.Insert(targetPosition - 1, link);

            for (int i = 0; i < allLinks.Count; i++)
                allLinks[i].SortOrder = i + 1;

            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? errorCode)> DeleteAsync(int id)
        {
            var link = await _context.ExternalLinks.FindAsync(id);
            if (link == null) return (false, "LINK_NOT_FOUND");

            if (!string.IsNullOrEmpty(link.PhotoPath))
                _fileService.DeleteFile(link.PhotoPath);

            _context.ExternalLinks.Remove(link);
            var saved = await _context.SaveChangesAsync() > 0;

            return saved ? (true, null) : (false, "DELETE_FAILED");
        }
    }
}
