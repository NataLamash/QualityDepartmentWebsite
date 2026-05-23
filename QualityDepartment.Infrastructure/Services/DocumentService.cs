using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QualityDepartment.Core.DTOs.Admin.Documents;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Core.Entities;
using QualityDepartment.Infrastructure.Data;

namespace QualityDepartment.Infrastructure.Services
{
    public class DocumentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentService> _logger;
        private readonly FileService _fileService;
        private const long MaxFileSizeBytes = 20 * 1024 * 1024;
        private readonly string saveFolder = "docs";
        private readonly string[] allowedExtensions = { ".pdf" };
        private readonly string[] allowedMimeTypes = { "application/pdf" };

        public DocumentService(ApplicationDbContext context, IMapper mapper, ILogger<DocumentService> logger, FileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _fileService = fileService;
        }

        public async Task<PagedResultDto<DocumentListItemDto>> GetDocumentsAsync(DocumentParams p)
        {
            var nowUtc = DateTime.UtcNow;

            var query = _context.Documents
                .Include(d => d.Category)
                .AsNoTracking()
                .AsQueryable()
                .Where(d => d.PublishDate <= nowUtc &&
                            d.Category.NameUa != "Внутрішнє оцінювання якості" &&
                            d.Category.NameUa != "Зовнішнє оцінювання якості");

            return await ExecutePagedQueryAsync(query, p);
        }

        public async Task<PagedResultDto<DocumentListItemDto>> GetDocumentsByCategoryNameAsync(string categoryNameUa, BaseDocumentParams p)
        {
            var nowUtc = DateTime.UtcNow;

            var query = _context.Documents
                .Include(d => d.Category)
                .AsNoTracking()
                .AsQueryable()
                .Where(d => d.PublishDate <= nowUtc && d.Category.NameUa == categoryNameUa);

            return await ExecutePagedQueryAsync(query, p);
        }

        private async Task<PagedResultDto<DocumentListItemDto>> ExecutePagedQueryAsync(IQueryable<Document> query, BaseDocumentParams p)
        {
            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var s = p.Search.Trim();
                query = query.Where(d =>
                    EF.Functions.Like(d.NameUa, $"%{s}%") ||
                    EF.Functions.Like(d.DescriptionUa, $"%{s}%") ||
                    EF.Functions.Like(d.NameEn, $"%{s}%") ||
                    EF.Functions.Like(d.DescriptionEn, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameUa, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameEn, $"%{s}%")
                );
            }

            if (p is DocumentParams docParams && docParams.CategoryIds != null && docParams.CategoryIds.Any())
            {
                query = query.Where(x => docParams.CategoryIds.Contains(x.CategoryId));
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

            var dtos = _mapper.Map<List<DocumentListItemDto>>(items, opt => opt.Items["lang"] = p.Lang);

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
                if (File.Exists(fullPath)) return FormatBytes(new FileInfo(fullPath).Length);
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
            int i; double dblSByte = bytes;
            for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
                dblSByte = bytes / 1024.0;
            return $"{dblSByte:0.##} {Suffix[i]}";
        }

        public async Task<(Stream stream, string contentType, string fileName)?> DownloadDocumentAsync(int id)
        {
            var doc = await _context.Documents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (doc == null || doc.ExternalType) return null;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
            if (!File.Exists(filePath)) return null;

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return (stream, GetContentType(filePath), Path.GetFileName(doc.FilePath));
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
            var doc = await _context.Documents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (doc == null || doc.ExternalType) return null;

            var ext = Path.GetExtension(doc.FilePath).ToLowerInvariant();
            if (!(new[] { ".pdf", ".jpg", ".jpeg", ".png" }).Contains(ext)) return null;

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
            if (!File.Exists(filePath)) return null;

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, true);
            return (stream, GetContentType(filePath), Path.GetFileName(doc.FilePath));
        }

        public async Task<List<LookupDto>> GetCategoriesLookupAsync(string lang = "ua")
        {
            return await _context.DocumentCategories
                .AsNoTracking()
                .Where(c => c.NameUa != "Внутрішнє оцінювання якості" && c.NameUa != "Зовнішнє оцінювання якості")
                .Select(c => new LookupDto { Id = c.Id, Name = lang == "en" ? c.NameEn : c.NameUa })
                .ToListAsync();
        }

        public async Task<DocumentAdminDetailsDto?> GetAdminByIdAsync(int id)
        {
            var doc = await _context.Documents
                .Include(d => d.Category).Include(d => d.Creator).Include(d => d.Editor)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            return doc == null ? null : _mapper.Map<DocumentAdminDetailsDto>(doc);
        }

        public async Task<PagedResultDto<DocumentAdminDto>> GetAdminDocumentsAsync(int page, int pageSize, string? search)
        {
            var query = _context.Documents.Include(d => d.Category).AsNoTracking();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(d =>
                    EF.Functions.Like(d.NameUa, $"%{s}%") ||
                    EF.Functions.Like(d.DescriptionUa, $"%{s}%") ||
                    EF.Functions.Like(d.NameEn, $"%{s}%") ||
                    EF.Functions.Like(d.DescriptionEn, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameUa, $"%{s}%") ||
                    EF.Functions.Like(d.Category.NameEn, $"%{s}%")
                );
            }

            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(d => d.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedResultDto<DocumentAdminDto>
            {
                Items = _mapper.Map<List<DocumentAdminDto>>(items),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<(DocumentAdminDto? result, string? errorCode)> CreateAsync(DocumentCreateDto dto, int userId)
        {
            var now = DateTime.UtcNow;
            if (dto.File == null) return (null, "FILE_REQUIRED");
            if (dto.File.Length > MaxFileSizeBytes) return (null, "FILE_TOO_LARGE");
            if (!_fileService.IsFileValid(dto.File, allowedExtensions, allowedMimeTypes))
                return (null, "INVALID_FILE_FORMAT");

            if (dto.PublishDate < now.AddMinutes(-5)) return (null, "DATE_CANNOT_BE_IN_PAST");
            if (dto.PublishDate > now.AddDays(7)) return (null, "DATE_TOO_FAR_IN_FUTURE");

            if (!await _context.DocumentCategories.AnyAsync(c => c.Id == dto.CategoryId))
                return (null, "CATEGORY_NOT_FOUND");

            var doc = _mapper.Map<Document>(dto);
            doc.CreatedAt = DateTime.UtcNow;
            doc.CreatorId = userId;
            //doc.ExternalType = false;
            doc.FilePath = await _fileService.SaveFileAsync(dto.File, saveFolder);

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();

            await _context.Entry(doc).Reference(d => d.Category).LoadAsync();

            return (_mapper.Map<DocumentAdminDto>(doc), null);
        }

        public async Task<(DocumentAdminDto? result, bool success, string? errorCode)> UpdateAsync(int id, DocumentUpdateDto dto, int userId)
        {
            var now = DateTime.UtcNow;
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return (null, false, "DOCUMENT_NOT_FOUND");

            if (dto.File != null)
            {
                if (dto.File.Length > MaxFileSizeBytes) return (null, false, "FILE_TOO_LARGE");
                if (!_fileService.IsFileValid(dto.File, allowedExtensions, allowedMimeTypes))
                    return (null, false, "INVALID_FILE_FORMAT");
            }

            bool isAlreadyPublished = doc.PublishDate <= now;
            if (isAlreadyPublished)
            {
                dto.PublishDate = doc.PublishDate;
            }
            else
            {
                if (dto.PublishDate < now.AddMinutes(-5)) return (null, false, "DATE_CANNOT_BE_IN_PAST");
                if (dto.PublishDate > now.AddDays(7)) return (null, false, "DATE_TOO_FAR_IN_FUTURE");
            }

            if (dto.CategoryId != doc.CategoryId)
            {
                if (!await _context.DocumentCategories.AnyAsync(c => c.Id == dto.CategoryId))
                    return (null, false, "CATEGORY_NOT_FOUND");
            }

            if (dto.File != null)
            {
                _fileService.DeleteFile(doc.FilePath);
                doc.FilePath = await _fileService.SaveFileAsync(dto.File, saveFolder);
            }

            _mapper.Map(dto, doc);
            doc.UpdatedAt = DateTime.UtcNow;
            doc.EditorId = userId;

            await _context.SaveChangesAsync();

            await _context.Entry(doc).Reference(d => d.Category).LoadAsync();

            return (_mapper.Map<DocumentAdminDto>(doc), true, null);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return false;

            if (!string.IsNullOrEmpty(doc.FilePath)) _fileService.DeleteFile(doc.FilePath);
            _context.Documents.Remove(doc);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}