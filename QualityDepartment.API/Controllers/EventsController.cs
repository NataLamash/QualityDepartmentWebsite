using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/events")]
    public class EventsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public EventsController(NewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResultDto<NewsListItemDto>>>> GetAllEvents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortOrder = "desc",
            [FromQuery] string? status = "published",
            [FromQuery] string lang = "ua",
            [FromQuery] string? search = null,
            [FromQuery] string? date = null)
        {
            var result = await _newsService.GetEventsAsync(page, pageSize, sortOrder, status, lang, search, date);
            return Ok(ApiResponse<PagedResultDto<NewsListItemDto>>.SuccessResponse(result));
        }
    }
}