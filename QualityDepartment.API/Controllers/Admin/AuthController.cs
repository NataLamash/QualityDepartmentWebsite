using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Auth;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService) => _authService = authService;

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null)
                return Unauthorized(ApiResponse<AuthResponseDto>.FailureResponse(new List<string> { "INVALID_CREDENTIALS" }));

            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result));
        }
    }
}