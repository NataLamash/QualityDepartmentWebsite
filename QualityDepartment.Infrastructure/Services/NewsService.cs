using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.News;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Core.Entities;
using QualityDepartment.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.Infrastructure.Services
{
    public class NewsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly FileService _fileService;
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
        private readonly string saveFolder = "news";
        private readonly string[] images = { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly string[] mimeTypes = { "image/jpeg", "image/png", "image/webp" };

        public NewsService(ApplicationDbContext context, IMapper mapper, FileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<PagedResultDto<NewsListItemDto>> GetNewsAsync(
                    int page, int pageSize, string sortOrder, string? status, string lang,
                    string? search, string? date, List<int>? tagIds)
        {
            IQueryable<New> query = _context.News
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => !x.Tags.Any(t => t.NameUa == "Заходи"));

            return await ExecutePagedNewsQueryAsync(query, page, pageSize, sortOrder, status, lang, search, date, tagIds);
        }
        public async Task<PagedResultDto<NewsListItemDto>> GetEventsAsync(
            int page, int pageSize, string sortOrder, string? status, string lang,
            string? search, string? date)
        {
            IQueryable<New> query = _context.News
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Tags.Any(t => t.NameUa == "Заходи"));

            return await ExecutePagedNewsQueryAsync(query, page, pageSize, sortOrder, status, lang, search, date, null);
        }

        private async Task<PagedResultDto<NewsListItemDto>> ExecutePagedNewsQueryAsync(
            IQueryable<New> query, int page, int pageSize, string sortOrder, string? status, string lang,
            string? search, string? date, List<int>? tagIds)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            if (!string.IsNullOrWhiteSpace(status) && status.Equals("published", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x => x.PublishDate <= DateTime.UtcNow);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(x =>
                    EF.Functions.Like(x.TitleUa, $"%{s}%") ||
                    EF.Functions.Like(x.FullTextUa, $"%{s}%") ||
                    EF.Functions.Like(x.TitleEn, $"%{s}%") ||
                    EF.Functions.Like(x.FullTextEn, $"%{s}%") ||
                    x.Tags.Any(t => EF.Functions.Like(t.NameUa, $"%{s}%") || EF.Functions.Like(t.NameEn, $"%{s}%")));
            }

            if (tagIds != null && tagIds.Any())
            {
                query = query.Where(x => x.Tags.Any(t => tagIds.Contains(t.Id)));
            }

            if (!string.IsNullOrWhiteSpace(date))
            {
                if (date.Contains(":"))
                {
                    var dates = date.Split(':');
                    if (DateTime.TryParse(dates[0], out var startDate))
                    {
                        DateTime endDate = (dates.Length < 2 || string.IsNullOrWhiteSpace(dates[1]) || !DateTime.TryParse(dates[1], out var parsedEnd))
                            ? startDate : parsedEnd;

                        var startOfDay = startDate.Date;
                        var endOfDay = endDate.Date.AddDays(1).AddTicks(-1);
                        query = query.Where(x => x.PublishDate >= startOfDay && x.PublishDate <= endOfDay);
                    }
                }
                else if (DateTime.TryParse(date, out var singleDate))
                {
                    query = query.Where(x => x.PublishDate.Date == singleDate.Date);
                }
            }

            query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(x => x.PublishDate)
                : query.OrderByDescending(x => x.PublishDate);

            var totalCount = await query.CountAsync();
            var newsList = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var items = _mapper.Map<List<NewsListItemDto>>(newsList, opt => opt.Items["lang"] = lang);

            return new PagedResultDto<NewsListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }


        public async Task<NewsDetailsDto?> GetNewsByIdAsync(int id, string lang = "ua")
        {
            var entity = await _context.News
                .Include(x => x.Tags)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id && x.PublishDate <= DateTime.UtcNow);

            if (entity == null)
                return null;

            return _mapper.Map<NewsDetailsDto>(entity, opt => opt.Items["lang"] = lang);
        }

        public async Task<NewsAdminDetailsDto?> GetAdminByIdAsync(int id)
        {
            var entity = await _context.News
                .AsNoTracking()
                .Include(x => x.Creator)
                .Include(x => x.Editor)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<NewsAdminDetailsDto>(entity);
        }

        public async Task<PagedResultDto<NewsAdminDto>> GetAdminNewsAsync(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            List<int>? tagIds = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;
            IQueryable<New> query = _context.News
                .AsNoTracking()
                .Include(n => n.Creator);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(x =>
                    EF.Functions.Like(x.TitleUa, $"%{s}%") ||
                    EF.Functions.Like(x.FullTextUa, $"%{s}%") ||
                    EF.Functions.Like(x.TitleEn, $"%{s}%") ||
                    EF.Functions.Like(x.FullTextEn, $"%{s}%") ||
                    x.Tags.Any(t => EF.Functions.Like(t.NameUa, $"%{s}%") || EF.Functions.Like(t.NameEn, $"%{s}%")));
            }

            if (tagIds != null && tagIds.Any())
            {
                query = query.Where(x => x.Tags.Any(t => tagIds.Contains(t.Id)));
            }

            query = query.OrderByDescending(x => x.PublishDate);

            var totalCount = await query.CountAsync();
            var newsList = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<NewsAdminDto>
            {
                Items = _mapper.Map<List<NewsAdminDto>>(newsList),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<(NewsAdminDto? Result, string? ErrorCode)> CreateAsync(NewsCreateDto dto, int creatorId)
        {

            if (dto.Photo != null && !_fileService.IsFileValid(dto.Photo, images, mimeTypes))
            {
                return (null, "INVALID_FILE_FORMAT");
            }

            if (dto.Photo != null && dto.Photo.Length > MaxFileSizeBytes)
                return (null, "FILE_TOO_LARGE");
            var normalizedTitle = dto.TitleUa.Trim().ToLower();

            if (await _context.News.AnyAsync(x =>
                x.TitleUa.ToLower() == normalizedTitle))
                return (null, "TITLE_ALREADY_EXISTS");

            var entity = _mapper.Map<New>(dto);
            entity.CreatorId = creatorId;
            entity.CreatedAt = DateTime.UtcNow;
            if (dto.TagIds.Any())
            {
                entity.Tags = await _context.Tags.Where(t => dto.TagIds.Contains(t.Id)).ToListAsync();
            }

            if (dto.Photo != null)
                entity.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);

            entity.CreatorId = creatorId;
            entity.CreatedAt = DateTime.UtcNow;

            _context.News.Add(entity);
            await _context.SaveChangesAsync();

            await _context.Entry(entity).Reference(x => x.Creator).LoadAsync();

            return (_mapper.Map<NewsAdminDto>(entity), null);
        }

        public async Task<(NewsAdminDto? Result, bool Success, string? ErrorCode)> UpdateAsync(int id, NewsUpdateDto dto, int editorId)
        {
            var now = DateTime.UtcNow;

            if (dto.Photo != null && dto.Photo.Length > MaxFileSizeBytes)
                return (null, false, "FILE_TOO_LARGE");

            if (dto.Photo != null && !_fileService.IsFileValid(dto.Photo, images, mimeTypes))
            {
                return (null, false, "INVALID_FILE_FORMAT");
            }

            var entity = await _context.News.Include(x => x.Tags).FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
                return (null, false, "NEWS_NOT_FOUND");

            bool isAlreadyPublished = entity.PublishDate <= now;

            if (isAlreadyPublished)
            {
                dto.PublishDate = entity.PublishDate;
            }
            else
            {
                if (dto.PublishDate < now.AddMinutes(-5))
                    return (null, false, "DATE_CANNOT_BE_IN_PAST");

                if (dto.PublishDate > now.AddDays(7))
                    return (null, false, "DATE_TOO_FAR_IN_FUTURE");
            }

            var isDuplicate = await _context.News.AnyAsync(x =>
                x.TitleUa.ToLower() == dto.TitleUa.Trim().ToLower() && x.Id != id);

            if (isDuplicate)
            {
                return (null, false, "TITLE_ALREADY_EXISTS");
            }

            if (dto.Photo != null)
            {
                _fileService.DeleteFile(entity.PhotoPath);
                entity.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);
            }
            else if (!dto.KeepOldPhoto)
            {
                _fileService.DeleteFile(entity.PhotoPath);
                entity.PhotoPath = null;
            }

            _mapper.Map(dto, entity);

            entity.Tags.Clear();
            if (dto.TagIds != null && dto.TagIds.Any())
            {
                entity.Tags = await _context.Tags.Where(t => dto.TagIds.Contains(t.Id)).ToListAsync();
            }

            entity.EditorId = editorId;
            entity.UpdatedAt = now;

            await _context.SaveChangesAsync();
            return (_mapper.Map<NewsAdminDto>(entity), true, null);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.News.FindAsync(id);
            if (entity == null) return false;

            _fileService.DeleteFile(entity.PhotoPath);

            _context.News.Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}