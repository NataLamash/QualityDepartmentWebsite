using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll([FromQuery] string lang = "ua")
        {
            var result = await _categoryService.GetAllAsync(lang);
            return Ok(ApiResponse<List<CategoryDto>>.SuccessResponse(result));
        }
    }
}
