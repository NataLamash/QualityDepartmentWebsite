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

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<NewsAdminDetailsDto>>> GetById(int id)
        {
            var result = await _newsService.GetAdminByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(ApiResponse<NewsAdminDetailsDto>.SuccessResponse(result));
        }

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
        public async Task<ActionResult<ApiResponse<NewsAdminDto>>> Create([FromForm] NewsCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var (result, errorCode) = await _newsService.CreateAsync(dto, userId);

            if (errorCode != null)
                return BadRequest(ApiResponse<NewsAdminDto>.FailureResponse(new List<string> { errorCode }));

            return Ok(ApiResponse<NewsAdminDto>.SuccessResponse(result!, "NEWS_CREATED_SUCCESS"));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Update(int id, [FromForm] NewsUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var (result, success, errorCode) = await _newsService.UpdateAsync(id, dto, userId);

            if (errorCode  != null)
                return BadRequest(ApiResponse<string>.FailureResponse(new List<string> { errorCode }));

            if (!success) return NotFound();

            return Ok(ApiResponse<NewsAdminDto>.SuccessResponse(result!, "NEWS_UPDATED_SUCCESS"));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
        {
            var success = await _newsService.DeleteAsync(id);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("NEW_DELETED_SUCCESSFULLY"))
                : NotFound(ApiResponse<string>.FailureResponse(new List<string> { "NEW_NOT_FOUND" }));
        }
    }
}
