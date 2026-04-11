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
            string lang = "ua",
            string? search = null,
            string? date = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            IQueryable<QualityDepartment.Core.Entities.New> query = _context.News.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status) &&
                status.Equals("published", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x => x.PublishDate <= DateTime.UtcNow);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(x =>
                    x.TitleUa.ToLower().Contains(searchLower) ||
                    x.TitleEn.ToLower().Contains(searchLower) ||
                    x.FullTextUa.ToLower().Contains(searchLower) ||
                    x.FullTextEn.ToLower().Contains(searchLower));
            }

            if (!string.IsNullOrWhiteSpace(date))
            {
                if (date.Contains(":"))
                {
                    var dates = date.Split(':');

                    if (DateTime.TryParse(dates[0], out var startDate))
                    {
                        DateTime endDate;
                        if (dates.Length < 2 || string.IsNullOrWhiteSpace(dates[1]) || !DateTime.TryParse(dates[1], out endDate))
                        {
                            endDate = startDate;
                        }

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

            var newsList = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<List<NewsListItemDto>>(
                newsList,
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