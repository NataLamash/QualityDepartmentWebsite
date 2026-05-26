using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagsController : ControllerBase
    {
        private readonly TagService _tagService;

        public TagsController(TagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TagDto>>>> GetAll([FromQuery] string lang = "ua")
        {
            var tags = await _tagService.GetTagsAsync(lang);
            return Ok(ApiResponse<List<TagDto>>.SuccessResponse(tags));
        }

        [HttpGet("events-id")]
        public async Task<ActionResult<ApiResponse<int>>> GetEventsTagId()
        {
            var id = await _tagService.GetTagIdByNameAsync("Заходи");
            if (id == null) return NotFound(ApiResponse<int>.FailureResponse(new List<string> { "TAG_NOT_FOUND" }));
            return Ok(ApiResponse<int>.SuccessResponse(id.Value));
        }
    }
}
