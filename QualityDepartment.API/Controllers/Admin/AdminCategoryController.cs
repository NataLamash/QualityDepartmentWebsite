using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/categories")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminCategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public AdminCategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryAdminDto>>>> GetAll()
        {
            var result = await _categoryService.GetAllAdminAsync();
            return Ok(ApiResponse<List<CategoryAdminDto>>.SuccessResponse(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CategoryAdminDto>>> GetById(int id)
        {
            var (result, errorCode) = await _categoryService.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<CategoryAdminDto>.FailureResponse(new List<string> { errorCode }));

            return Ok(ApiResponse<CategoryAdminDto>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CategoryAdminDto>>> Create([FromBody] CategoryCreateUpdateDto dto)
        {
            var (result, errorCode) = await _categoryService.CreateAsync(dto);

            if (result == null)
            {
                return BadRequest(ApiResponse<CategoryDto>.FailureResponse(new List<string> { errorCode ?? "CREATE_FAILED" }));
            }

            return Ok(ApiResponse<CategoryAdminDto>.SuccessResponse(result, "CATEGORY_CREATED_SUCCESS"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] CategoryCreateUpdateDto dto)
        {
            var (success, errorCode) = await _categoryService.UpdateAsync(id, dto);

            if (!success)
            {
                return BadRequest(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "UPDATE_FAILED" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "CATEGORY_UPDATED_SUCCESS"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var (success, errorCode) = await _categoryService.DeleteAsync(id);

            if (!success)
            {
                return BadRequest(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "DELETE_FAILED" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "CATEGORY_DELETED_SUCCESS"));
        }
    }
}
