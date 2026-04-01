using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QualityDepartment.Core.DTOs.ExternalLinks;
using QualityDepartment.Infrastructure.Data;
using QualityDepartment.Core.Mappings;
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

        public async Task<ExternalLinkDto?> GetByIdAsync(int id, string lang = "ua")
        {
            _logger.LogInformation("Fetching external link details for ID: {Id}, Language: {Lang}", id, lang);

            var link = await _context.ExternalLinks
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == id && l.PublishDate <= DateTime.UtcNow);

            if (link == null)
            {
                _logger.LogWarning("External link with ID: {Id} not found or not published yet.", id);
                return null;
            }

            return _mapper.Map<ExternalLinkDto>(link, opt => opt.Items["lang"] = lang);
        }
    }
}
