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

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword(
            [FromBody] ForgotPasswordDto dto)
        {
            await _authService.ForgotPasswordAsync(dto.Email);

            return Ok(
                ApiResponse<bool>.SuccessResponse(
                    true,
                    "Якщо обліковий запис з такою електронною адресою існує, ми надіслали інструкції для відновлення пароля."));
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ResetPassword(
            [FromBody] ResetPasswordDto dto)
        {
            var result = await _authService.ResetPasswordAsync(dto);

            if (!result.Succeeded)
            {
                var errors = result.Errors
                    .Select(error => error.Code)
                    .ToList();

                return BadRequest(
                    ApiResponse<bool>.FailureResponse(
                        errors,
                        "PASSWORD_RESET_FAILED"));
            }

            return Ok(
                ApiResponse<bool>.SuccessResponse(
                    true,
                    "Пароль успішно змінено."));
        }
    }
}