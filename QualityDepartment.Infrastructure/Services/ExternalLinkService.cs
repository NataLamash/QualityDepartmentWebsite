using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QualityDepartment.Core.DTOs.ExternalLinks;
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
        private readonly ILogger<ExternalLinkService> _logger;

        public ExternalLinkService(ApplicationDbContext context, IMapper mapper, ILogger<ExternalLinkService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<List<ExternalLinkDto>> GetActiveLinksAsync(string lang = "ua")
        {
            _logger.LogInformation("Fetching external links. Language: {Lang}", lang);

            var links = await _context.ExternalLinks
                .AsNoTracking()
                .Where(l => l.PublishDate <= DateTime.UtcNow)
                .OrderBy(l => l.SortOrder)
                .ThenByDescending(l => l.PublishDate)
                .ToListAsync();

            return _mapper.Map<List<ExternalLinkDto>>(links, opt => opt.Items["lang"] = lang);
        }
    }
}
