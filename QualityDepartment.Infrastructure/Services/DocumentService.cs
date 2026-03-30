using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Infrastructure.Data;

namespace QualityDepartment.Infrastructure.Services
{
    public class DocumentService
    {
        private readonly ApplicationDbContext _context;

        public DocumentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<DocumentListItemDto>> GetDocumentsAsync(DocumentParams p)
        {
            var query = _context.Documents
                .Include(d => d.Category)
                .AsNoTracking()
                .AsQueryable();

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

            var dtos = items.Select(d => new DocumentListItemDto
            {
                Id = d.Id,
                Name = p.Lang == "en" ? d.NameEn : d.NameUa,
                Description = p.Lang == "en" ? d.DescriptionEn : d.DescriptionUa,
                CategoryName = p.Lang == "en" ? d.Category.NameEn : d.Category.NameUa,
                FilePath = d.FilePath,
                PublishDate = d.PublishDate,
                ExternalType = d.ExternalType
            }).ToList();

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

            string formattedSize = "0 KB";
            string extension = Path.GetExtension(doc.FilePath) ?? "unknown";

            try
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    long bytes = new FileInfo(fullPath).Length;
                    formattedSize = FormatBytes(bytes);
                }
            }
            catch { }

            return new DocumentDetailsDto
            {
                Id = doc.Id,
                Name = lang == "en" ? doc.NameEn : doc.NameUa,
                Description = (lang == "en" ? doc.DescriptionEn : doc.DescriptionUa) ?? string.Empty,
                CategoryName = lang == "en" ? doc.Category.NameEn : doc.Category.NameUa,
                PublishDate = doc.PublishDate,
                FilePath = doc.FilePath,
                FileType = extension,
                FileSize = formattedSize,
                Lang = lang,
                ExternalType = doc.ExternalType
            };
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
            var doc = await _context.Documents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            if (doc == null || doc.ExternalType) return null;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));

            if (!File.Exists(filePath)) return null;

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