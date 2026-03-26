using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortOrder = "desc",
            [FromQuery] string? status = "published",
            [FromQuery] string lang = "ua")
        {
            var result = await _newsService.GetNewsAsync(page, pageSize, sortOrder, status, lang);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] string lang = "ua")
        {
            var result = await _newsService.GetNewsByIdAsync(id, lang);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}