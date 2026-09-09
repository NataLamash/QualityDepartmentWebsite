using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Profile;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Collections.Generic;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/admin/profile")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;

        public AdminProfileController(
            ProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        public async Task<
            ActionResult<ApiResponse<AdminProfileDto>>> GetProfile()
        {
            if (!TryGetCurrentUserId(out var userId))
                return Unauthorized();

            var profile =
                await _profileService.GetProfileAsync(userId);

            if (profile == null)
            {
                return NotFound(
                    ApiResponse<AdminProfileDto>.FailureResponse(
                        new List<string>
                        {
                            "USER_NOT_FOUND"
                        }));
            }

            return Ok(
                ApiResponse<AdminProfileDto>.SuccessResponse(
                    profile));
        }

        [HttpPut]
        public async Task<
            ActionResult<ApiResponse<AdminProfileDto>>> UpdateProfile(
            [FromBody] UpdateAdminProfileDto dto)
        {
            if (!TryGetCurrentUserId(out var userId))
                return Unauthorized();

            var result =
                await _profileService.UpdateProfileAsync(
                    userId,
                    dto);

            if (result.Profile != null)
            {
                return Ok(
                    ApiResponse<AdminProfileDto>.SuccessResponse(
                        result.Profile,
                        "Профіль успішно оновлено."));
            }

            if (result.Errors.Contains("USER_NOT_FOUND"))
            {
                return NotFound(
                    ApiResponse<AdminProfileDto>.FailureResponse(
                        result.Errors));
            }

            return BadRequest(
                ApiResponse<AdminProfileDto>.FailureResponse(
                    result.Errors,
                    "PROFILE_UPDATE_FAILED"));
        }

        [HttpPut("password")]
        public async Task<ActionResult<ApiResponse<bool>>> ChangePassword(
    [FromBody] ChangePasswordDto dto)
        {
            if (!TryGetCurrentUserId(out var userId))
                return Unauthorized();

            var result = await _profileService.ChangePasswordAsync(
                userId,
                dto);

            if (result.Succeeded)
            {
                return Ok(
                    ApiResponse<bool>.SuccessResponse(
                        true,
                        "Пароль успішно змінено."));
            }

            var errors = result.Errors
                .Select(error => error.Code)
                .ToList();

            if (errors.Contains("USER_NOT_FOUND"))
            {
                return NotFound(
                    ApiResponse<bool>.FailureResponse(
                        errors));
            }

            return BadRequest(
                ApiResponse<bool>.FailureResponse(
                    errors,
                    "PASSWORD_CHANGE_FAILED"));
        }

        private bool TryGetCurrentUserId(out int userId)
        {
            var claimValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            return int.TryParse(
                claimValue,
                out userId);
        }
    }
}