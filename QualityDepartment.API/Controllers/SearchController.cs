using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Search;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController(SearchService searchService) => _searchService = searchService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<GlobalSearchResultDto>>>> GlobalSearch(
            [FromQuery] string query,
            [FromQuery] string lang = "ua")
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 3)
            {
                return BadRequest(ApiResponse<List<GlobalSearchResultDto>>.FailureResponse(
                    new List<string> { "SEARCH_QUERY_TOO_SHORT" }));
            }

            var results = await _searchService.SearchAsync(query, lang);
            return Ok(ApiResponse<List<GlobalSearchResultDto>>.SuccessResponse(results));
        }
    }
}
