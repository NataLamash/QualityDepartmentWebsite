using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public NewsController(NewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResultDto<NewsListItemDto>>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortOrder = "desc",
            [FromQuery] string? status = "published",
            [FromQuery] string lang = "ua",
            [FromQuery] string? search = null,
            [FromQuery] string? date = null,
            [FromQuery] List<int>? tagIds = null)
        {
            var result = await _newsService.GetNewsAsync(page, pageSize, sortOrder, status, lang, search, date, tagIds);
            return Ok(ApiResponse<PagedResultDto<NewsListItemDto>>.SuccessResponse(result));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<NewsDetailsDto>>> GetById(int id, [FromQuery] string lang = "ua")
        {
            var result = await _newsService.GetNewsByIdAsync(id, lang);

            if (result == null)
                return NotFound(ApiResponse<object>.FailureResponse(
                    new List<string> { "News not found" }, "Новину не знайдено"));

            return Ok(ApiResponse<NewsDetailsDto>.SuccessResponse(result));
        }
    }
}