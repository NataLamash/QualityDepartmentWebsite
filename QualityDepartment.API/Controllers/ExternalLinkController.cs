using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.ExternalLinks;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/external-links")]
    public class ExternalLinkController : ControllerBase
    {
        private readonly ExternalLinkService _externalLinkService;
        private readonly ILogger<ExternalLinkController> _logger;

        public ExternalLinkController(ExternalLinkService externalLinkService, ILogger<ExternalLinkController> logger)
        {
            _externalLinkService = externalLinkService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ExternalLinkDto>>>> GetAll([FromQuery] string lang = "ua")
        {
            _logger.LogInformation("API: Fetching all external links. Language: {Lang}", lang);

            var links = await _externalLinkService.GetActiveLinksAsync(lang);

            return Ok(ApiResponse<List<ExternalLinkDto>>.SuccessResponse(links));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<ExternalLinkDto>>> GetById(int id, [FromQuery] string lang = "ua")
        {
            _logger.LogInformation("API: Requested link details for ID: {Id}", id);

            var result = await _externalLinkService.GetByIdAsync(id, lang);

            if (result == null)
            {
                return NotFound(ApiResponse<object>.FailureResponse(
                    new List<string> { "External link not found" },
                    lang == "en" ? "Link not found" : "Посилання не знайдено"));
            }

            return Ok(ApiResponse<ExternalLinkDto>.SuccessResponse(result));
        }
    }
}
