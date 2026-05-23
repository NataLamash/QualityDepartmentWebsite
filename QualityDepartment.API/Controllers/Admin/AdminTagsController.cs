using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.News;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/tags")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminTagsController : ControllerBase
    {
        private readonly TagService _tagService;

        public AdminTagsController(TagService tagService) => _tagService = tagService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AdminTagDto>>>> GetAll()
        {
            var tags = await _tagService.GetAllAdminAsync();
            return Ok(ApiResponse<List<AdminTagDto>>.SuccessResponse(tags));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<AdminTagDto>>> GetById(int id)
        {
            var (result, errorCode) = await _tagService.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<AdminTagDto>.FailureResponse(new List<string> { errorCode }));

            return Ok(ApiResponse<AdminTagDto>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AdminTagDto>>> Create([FromBody] TagCreateUpdateDto dto)
        {
            var (result, errorCode) = await _tagService.CreateAsync(dto);

            if (result == null)
            {
                return BadRequest(ApiResponse<AdminTagDto>.FailureResponse(new List<string> { errorCode }));
            }

            return Ok(ApiResponse<AdminTagDto>.SuccessResponse(result, "TAG_CREATED_SUCCESS"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] TagCreateUpdateDto dto)
        {
            var (success, errorCode) = await _tagService.UpdateAsync(id, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "UPDATE_FAILED" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "TAG_UPDATED_SUCCESS"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var (success, errorCode) = await _tagService.DeleteAsync(id);

            if (!success)
            {
                return BadRequest(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "DELETE_FAILED" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "TAG_DELETED_SUCCESS"));
        }
    }
}
