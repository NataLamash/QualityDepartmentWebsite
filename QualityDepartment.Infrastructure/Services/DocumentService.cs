using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Infrastructure.Data;

namespace QualityDepartment.Infrastructure.Services
{
    public class DocumentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentService> _logger;

        public DocumentService(ApplicationDbContext context, IMapper mapper, ILogger<DocumentService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PagedResultDto<DocumentListItemDto>> GetDocumentsAsync(DocumentParams p)
        {
            var query = _context.Documents
                .Include(d => d.Category)
                .AsNoTracking()
                .AsQueryable()
                .Where(d => d.PublishDate <= DateTime.UtcNow); ;

            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var s = p.Search.ToLower();
                query = p.Lang == "en"
                    ? query.Where(d => d.NameEn.Contains(s) || d.DescriptionEn.Contains(s))
                    : query.Where(d => d.NameUa.Contains(s) || d.DescriptionUa.Contains(s));
            }

            if (p.CategoryId.HasValue)
            {
                query = query.Where(d => d.CategoryId == p.CategoryId);
            }

            query = p.Sort switch
            {
                "dateAsc" => query.OrderBy(d => d.PublishDate),
                "nameAsc" => p.Lang == "en" ? query.OrderBy(d => d.NameEn) : query.OrderBy(d => d.NameUa),
                "nameDesc" => p.Lang == "en" ? query.OrderByDescending(d => d.NameEn) : query.OrderByDescending(d => d.NameUa),
                _ => query.OrderByDescending(d => d.PublishDate)
            };

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync();

            var dtos = _mapper
                .Map<List<DocumentListItemDto>>
                (
                    items, 
                    opt => opt.Items["lang"] = p.Lang
                );

            return new PagedResultDto<DocumentListItemDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = p.PageNumber,
                PageSize = p.PageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)p.PageSize)
            };
        }
        public async Task<DocumentDetailsDto?> GetDocumentByIdAsync(int id, string lang = "ua")
        {
            var doc = await _context.Documents
                .Include(d => d.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (doc == null) return null;

            var dto = _mapper.Map<DocumentDetailsDto>(doc, opt => opt.Items["lang"] = lang);

            dto.FileType = Path.GetExtension(doc.FilePath) ?? "unknown";
            dto.FileSize = GetFormattedFileSize(doc.FilePath);

            return dto;
        }

        private string GetFormattedFileSize(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    return FormatBytes(new FileInfo(fullPath).Length);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting file size for {Path}", filePath);
            }
            return "0 KB";
        }
        private string FormatBytes(long bytes)
        {
            string[] Suffix = { "B", "KB", "MB", "GB" };
            int i;
            double dblSByte = bytes;
            for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
            {
                dblSByte = bytes / 1024.0;
            }
            return $"{dblSByte:0.##} {Suffix[i]}";
        }

        public async Task<(Stream stream, string contentType, string fileName)?> DownloadDocumentAsync(int id)
        {
            _logger.LogInformation("Attempting to download document with ID: {Id}", id);
            var doc = await _context.Documents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            if (doc == null || doc.ExternalType) return null;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));

            if (!File.Exists(filePath))
            {
                _logger.LogWarning("Download failed: Document {Id} not found in database", id);
                return null;
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

            var contentType = GetContentType(filePath);
            var fileName = Path.GetFileName(doc.FilePath);

            return (stream, contentType, fileName);
        }

        private string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                _ => "application/octet-stream",
            };
        }

        public async Task<(Stream stream, string contentType, string fileName)?> GetDocumentPreviewAsync(int id)
        {
            var doc = await _context.Documents
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (doc == null || doc.ExternalType) return null;

            var ext = Path.GetExtension(doc.FilePath).ToLowerInvariant();

            var allowedPreview = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            if (!allowedPreview.Contains(ext)) return null;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));

            if (!File.Exists(filePath)) return null;

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, true);

            var contentType = GetContentType(filePath);

            return (stream, contentType, Path.GetFileName(doc.FilePath));
        }

        public async Task<List<LookupDto>> GetCategoriesLookupAsync(string lang = "ua")
        {
            return await _context.DocumentCategories
                .AsNoTracking()
                .Select(c => new LookupDto
                {
                    Id = c.Id,
                    Name = lang == "en" ? c.NameEn : c.NameUa
                })
                .ToListAsync();
        }
    }
}