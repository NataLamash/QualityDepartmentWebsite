using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.News;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers.Admin
{
    [Authorize(Policy = "AdminOnly")]
    [ApiController]
    [Route("api/admin/news")]
    public class AdminNewsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public AdminNewsController(NewsService newsService) => _newsService = newsService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResultDto<NewsAdminDto>>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var result = await _newsService.GetAdminNewsAsync(page, pageSize, search);
            return Ok(ApiResponse<PagedResultDto<NewsAdminDto>>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<NewsAdminDto>>> Create([FromForm] NewsCreateUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var (result, errors) = await _newsService.CreateAsync(dto, userId);

            if (errors != null)
                return BadRequest(ApiResponse<NewsAdminDto>.FailureResponse(errors, "Помилка створення"));

            return Ok(ApiResponse<NewsAdminDto>.SuccessResponse(result!));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Update(int id, [FromBody] NewsCreateUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var (success, errors) = await _newsService.UpdateAsync(id, dto, userId);

            if (errors != null)
                return BadRequest(ApiResponse<string>.FailureResponse(errors, "Помилка оновлення"));

            if (!success) return NotFound();

            return Ok(ApiResponse<string>.SuccessResponse("Новину успішно оновлено"));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
        {
            var success = await _newsService.DeleteAsync(id);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("Видалено"))
                : NotFound(ApiResponse<string>.FailureResponse(new List<string> { "Новину не знайдено" }));
        }
    }
}
