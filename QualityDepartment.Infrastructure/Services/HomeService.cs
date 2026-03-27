using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Home;
using QualityDepartment.Infrastructure.Data;

namespace QualityDepartment.Infrastructure.Services
{
    public class HomeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HomeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<HomeNewsCardDto>> GetLatestNewsAsync(int count = 3, string lang = "ua")
        {
            if (count < 1)
                count = 3;

            if (count > 20)
                count = 20;

            var news = await _context.News
                .AsNoTracking()
                .Where(x => x.PublishDate <= DateTime.UtcNow)
                .OrderByDescending(x => x.PublishDate)
                .Take(count)
                .ToListAsync();

            return _mapper.Map<List<HomeNewsCardDto>>(
                news,
                opt => opt.Items["lang"] = lang);
        }

        public async Task<List<AdministrationMemberCardDto>> GetAdministrationMembersAsync(string lang = "ua")
        {
            var members = await _context.AdministrationMembers
                .AsNoTracking()
                .OrderBy(x => x.SortOrder)
                .ThenBy(x => x.Id)
                .ToListAsync();

            return _mapper.Map<List<AdministrationMemberCardDto>>(
                members,
                opt => opt.Items["lang"] = lang);
        }
    }
}