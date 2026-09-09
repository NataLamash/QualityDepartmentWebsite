using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Users;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Collections.Generic;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Policy = "SuperAdminOnly")]
    public class AdminUsersController : ControllerBase
    {
        private readonly AdminUserService _adminUserService;

        public AdminUsersController(
            AdminUserService adminUserService)
        {
            _adminUserService = adminUserService;
        }

        [HttpGet]
        public async Task<
            ActionResult<ApiResponse<List<AdminUserDto>>>>
            GetUsers()
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized();

            var users =
                await _adminUserService.GetUsersAsync(
                    currentUserId);

            return Ok(
                ApiResponse<List<AdminUserDto>>
                    .SuccessResponse(users));
        }

        [HttpPut("{id:int}")]
        public async Task<
            ActionResult<ApiResponse<AdminUserDto>>>
            UpdateUser(
                int id,
                [FromBody] UpdateAdminUserDto dto)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized();

            var result =
                await _adminUserService.UpdateUserAsync(
                    id,
                    currentUserId,
                    dto);

            if (result.User != null)
            {
                return Ok(
                    ApiResponse<AdminUserDto>
                        .SuccessResponse(
                            result.User,
                            "Дані адміністратора оновлено."));
            }

            return CreateFailureResponse(
                result.Errors,
                "ADMIN_UPDATE_FAILED");
        }

        [HttpPut("{id:int}/role")]
        public async Task<
            ActionResult<ApiResponse<AdminUserDto>>>
            ChangeRole(
                int id,
                [FromBody] ChangeAdminRoleDto dto)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized();

            var result =
                await _adminUserService.ChangeRoleAsync(
                    id,
                    currentUserId,
                    dto);

            if (result.User != null)
            {
                return Ok(
                    ApiResponse<AdminUserDto>
                        .SuccessResponse(
                            result.User,
                            "Роль адміністратора змінено."));
            }

            return CreateFailureResponse(
                result.Errors,
                "ROLE_CHANGE_FAILED");
        }

        [HttpPut("{id:int}/block")]
        public async Task<
            ActionResult<ApiResponse<AdminUserDto>>>
            BlockUser(int id)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized();

            var result =
                await _adminUserService.SetBlockedAsync(
                    id,
                    currentUserId,
                    true);

            if (result.User != null)
            {
                return Ok(
                    ApiResponse<AdminUserDto>
                        .SuccessResponse(
                            result.User,
                            "Адміністратора заблоковано."));
            }

            return CreateFailureResponse(
                result.Errors,
                "BLOCK_FAILED");
        }

        [HttpPut("{id:int}/unblock")]
        public async Task<
            ActionResult<ApiResponse<AdminUserDto>>>
            UnblockUser(int id)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized();

            var result =
                await _adminUserService.SetBlockedAsync(
                    id,
                    currentUserId,
                    false);

            if (result.User != null)
            {
                return Ok(
                    ApiResponse<AdminUserDto>
                        .SuccessResponse(
                            result.User,
                            "Адміністратора розблоковано."));
            }

            return CreateFailureResponse(
                result.Errors,
                "UNBLOCK_FAILED");
        }

        private ActionResult<ApiResponse<AdminUserDto>>
            CreateFailureResponse(
                List<string> errors,
                string message)
        {
            if (errors.Contains("USER_NOT_FOUND"))
            {
                return NotFound(
                    ApiResponse<AdminUserDto>
                        .FailureResponse(errors));
            }

            return BadRequest(
                ApiResponse<AdminUserDto>
                    .FailureResponse(
                        errors,
                        message));
        }

        private bool TryGetCurrentUserId(
            out int userId)
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