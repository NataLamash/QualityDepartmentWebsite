using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Infrastructure.Data;

namespace QualityDepartment.Infrastructure.Services
{
    public class NewsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public NewsService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<NewsListItemDto>> GetNewsAsync(
            int page = 1,
            int pageSize = 10,
            string sortOrder = "desc",
            string? status = "published",
            string lang = "ua")
        {
            if (page < 1)
                page = 1;

            if (pageSize < 1)
                pageSize = 10;

            if (pageSize > 100)
                pageSize = 100;

            IQueryable<Core.Entities.New> query = _context.News.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status) &&
                status.Equals("published", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x => x.PublishDate <= DateTime.UtcNow);
            }

            query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(x => x.PublishDate)
                : query.OrderByDescending(x => x.PublishDate);

            var totalCount = await query.CountAsync();

            var news = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<List<NewsListItemDto>>(
                news,
                opt => opt.Items["lang"] = lang);

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
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id && x.PublishDate <= DateTime.UtcNow);

            if (entity == null)
                return null;

            return _mapper.Map<NewsDetailsDto>(
                entity,
                opt => opt.Items["lang"] = lang);
        }
    }
}