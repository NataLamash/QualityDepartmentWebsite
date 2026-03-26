using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetLatestNews(
            [FromQuery] int count = 3,
            [FromQuery] string lang = "ua")
        {
            var result = await _homeService.GetLatestNewsAsync(count, lang);
            return Ok(result);
        }

        [HttpGet("administration")]
        public async Task<IActionResult> GetAdministration([FromQuery] string lang = "ua")
        {
            var result = await _homeService.GetAdministrationMembersAsync(lang);
            return Ok(result);
        }
    }
}