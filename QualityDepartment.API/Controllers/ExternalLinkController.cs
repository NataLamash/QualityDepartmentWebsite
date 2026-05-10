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

        private readonly ExternalLinkService _linkService;
        public ExternalLinkController(ExternalLinkService linkService) => _linkService = linkService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ExternalLinkDto>>>> GetPublic([FromQuery] string lang = "ua")
        {
            var links = await _linkService.GetPublicLinksAsync(lang);
            return Ok(ApiResponse<List<ExternalLinkDto>>.SuccessResponse(links));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ExternalLinkDto>>> GetById(int id, [FromQuery] string lang = "ua")
        {
            var (result, errorCode) = await _linkService.GetPublicByIdAsync(id, lang);

            if (result == null)
                return NotFound(ApiResponse<ExternalLinkDto>.FailureResponse(new List<string> { errorCode! }));

            return Ok(ApiResponse<ExternalLinkDto>.SuccessResponse(result));
        }
    }
}
