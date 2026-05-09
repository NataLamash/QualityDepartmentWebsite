using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public AdminTagsController(TagService tagService)
        {
            _tagService = tagService;
        }

        // Публічний метод для отримання списку тегів (для фільтрів на сайті)
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TagDto>>>> GetAll([FromQuery] string lang = "ua")
        {
            var tags = await _tagService.GetTagsAsync(lang);
            return Ok(ApiResponse<List<TagDto>>.SuccessResponse(tags));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TagDto>>> Create([FromBody] TagCreateUpdateDto dto)
        {
            var result = await _tagService.CreateAsync(dto);
            return Ok(ApiResponse<TagDto>.SuccessResponse(result, "TAG_CREATED_SUCCESS"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] TagCreateUpdateDto dto)
        {
            var success = await _tagService.UpdateAsync(id, dto);

            if (!success)
            {
                return NotFound(ApiResponse<bool>.FailureResponse(new List<string> { "TAG_NOT_FOUND" }, "Update failed"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "TAG_UPDATED_SUCCESS"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var success = await _tagService.DeleteAsync(id);

            if (!success)
            {
                return NotFound(ApiResponse<bool>.FailureResponse(new List<string> { "TAG_NOT_FOUND" }, "Deletion failed"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "TAG_DELETED_SUCCESS"));
        }
    }
}
