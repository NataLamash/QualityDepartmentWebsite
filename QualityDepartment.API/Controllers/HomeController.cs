using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Home;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/home")]
    public class HomeController : ControllerBase
    {
        private readonly HomeService _homeService;

        public HomeController(HomeService homeService)
        {
            _homeService = homeService;
        }

        [HttpGet("latest-news")]
        public async Task<ActionResult<ApiResponse<List<HomeNewsCardDto>>>> GetLatestNews(
            [FromQuery] int count = 3,
            [FromQuery] string lang = "ua")
        {
            var result = await _homeService.GetLatestNewsAsync(count, lang);
            return Ok(ApiResponse<List<HomeNewsCardDto>>.SuccessResponse(result));
        }

        [HttpGet("administration")]
        public async Task<ActionResult<ApiResponse<List<AdministrationMemberCardDto>>>> GetAdministration([FromQuery] string lang = "ua")
        {
            var result = await _homeService.GetAdministrationMembersAsync(lang);
            return Ok(ApiResponse<List<AdministrationMemberCardDto>>.SuccessResponse(result));
        }
    }
}