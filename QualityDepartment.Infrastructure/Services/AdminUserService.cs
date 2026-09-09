using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.Users;
using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace QualityDepartment.Infrastructure.Services
{
    public class AdminUserService
    {
        private static readonly HashSet<string> AllowedRoles =
            new(StringComparer.Ordinal)
            {
                "Admin",
                "SuperAdmin"
            };

        private readonly UserManager<ApplicationUser> _userManager;

        public AdminUserService(
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<AdminUserDto>> GetUsersAsync(
            int currentUserId)
        {
            var users = await _userManager.Users
                .OrderBy(user => user.Email)
                .ToListAsync();

            var result = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var mapped = await MapUserAsync(
                    user,
                    currentUserId);

                if (mapped != null)
                {
                    result.Add(mapped);
                }
            }

            return result;
        }

        public async Task<
            (AdminUserDto? User, List<string> Errors)>
            UpdateUserAsync(
                int targetUserId,
                int currentUserId,
                UpdateAdminUserDto dto)
        {
            var user = await FindManagedAdminAsync(
                targetUserId);

            if (user == null)
            {
                return (
                    null,
                    new List<string>
                    {
                        "USER_NOT_FOUND"
                    }
                );
            }

            var email = dto.Email.Trim();

            var existingUser =
                await _userManager.FindByEmailAsync(email);

            if (existingUser != null &&
                existingUser.Id != user.Id)
            {
                return (
                    null,
                    new List<string>
                    {
                        "EMAIL_ALREADY_IN_USE"
                    }
                );
            }

            user.LastName = dto.LastName.Trim();
            user.FirstName = dto.FirstName.Trim();

            user.Patronymic =
                string.IsNullOrWhiteSpace(dto.Patronymic)
                    ? null
                    : dto.Patronymic.Trim();

            user.PhoneNumber =
                string.IsNullOrWhiteSpace(dto.PhoneNumber)
                    ? null
                    : dto.PhoneNumber.Trim();

            IdentityResult updateResult;

            if (!string.Equals(
                    user.Email,
                    email,
                    StringComparison.OrdinalIgnoreCase))
            {
                updateResult =
                    await _userManager.SetEmailAsync(
                        user,
                        email);
            }
            else
            {
                updateResult =
                    await _userManager.UpdateAsync(user);
            }

            if (!updateResult.Succeeded)
            {
                return (
                    null,
                    ToErrors(updateResult)
                );
            }

            return (
                await MapUserAsync(
                    user,
                    currentUserId),
                new List<string>()
            );
        }

        public async Task<
            (AdminUserDto? User, List<string> Errors)>
            ChangeRoleAsync(
                int targetUserId,
                int currentUserId,
                ChangeAdminRoleDto dto)
        {
            if (!AllowedRoles.Contains(dto.Role))
            {
                return (
                    null,
                    new List<string>
                    {
                        "INVALID_ROLE"
                    }
                );
            }

            if (targetUserId == currentUserId)
            {
                return (
                    null,
                    new List<string>
                    {
                        "SELF_ROLE_CHANGE_FORBIDDEN"
                    }
                );
            }

            var user = await FindManagedAdminAsync(
                targetUserId);

            if (user == null)
            {
                return (
                    null,
                    new List<string>
                    {
                        "USER_NOT_FOUND"
                    }
                );
            }

            var roles =
                await _userManager.GetRolesAsync(user);

            if (!roles.Contains(dto.Role))
            {
                var addResult =
                    await _userManager.AddToRoleAsync(
                        user,
                        dto.Role);

                if (!addResult.Succeeded)
                {
                    return (
                        null,
                        ToErrors(addResult)
                    );
                }
            }

            var roleToRemove =
                dto.Role == "Admin"
                    ? "SuperAdmin"
                    : "Admin";

            if (roles.Contains(roleToRemove))
            {
                var removeResult =
                    await _userManager.RemoveFromRoleAsync(
                        user,
                        roleToRemove);

                if (!removeResult.Succeeded)
                {
                    return (
                        null,
                        ToErrors(removeResult)
                    );
                }
            }

            return (
                await MapUserAsync(
                    user,
                    currentUserId),
                new List<string>()
            );
        }

        public async Task<
            (AdminUserDto? User, List<string> Errors)>
            SetBlockedAsync(
                int targetUserId,
                int currentUserId,
                bool blocked)
        {
            if (blocked &&
                targetUserId == currentUserId)
            {
                return (
                    null,
                    new List<string>
                    {
                        "SELF_BLOCK_FORBIDDEN"
                    }
                );
            }

            var user = await FindManagedAdminAsync(
                targetUserId);

            if (user == null)
            {
                return (
                    null,
                    new List<string>
                    {
                        "USER_NOT_FOUND"
                    }
                );
            }

            var lockoutEnabled =
                await _userManager
                    .GetLockoutEnabledAsync(user);

            if (blocked && !lockoutEnabled)
            {
                var enableResult =
                    await _userManager
                        .SetLockoutEnabledAsync(
                            user,
                            true);

                if (!enableResult.Succeeded)
                {
                    return (
                        null,
                        ToErrors(enableResult)
                    );
                }
            }

            if (!blocked && !lockoutEnabled)
            {
                return (
                    await MapUserAsync(
                        user,
                        currentUserId),
                    new List<string>()
                );
            }

            var lockoutResult =
                await _userManager
                    .SetLockoutEndDateAsync(
                        user,
                        blocked
                            ? DateTimeOffset.UtcNow
                                .AddYears(100)
                            : null);

            if (!lockoutResult.Succeeded)
            {
                return (
                    null,
                    ToErrors(lockoutResult)
                );
            }

            return (
                await MapUserAsync(
                    user,
                    currentUserId),
                new List<string>()
            );
        }

        private async Task<ApplicationUser?>
            FindManagedAdminAsync(int userId)
        {
            var user =
                await _userManager.FindByIdAsync(
                    userId.ToString());

            if (user == null)
                return null;

            var roles =
                await _userManager.GetRolesAsync(user);

            return roles.Any(
                role => AllowedRoles.Contains(role))
                ? user
                : null;
        }

        private async Task<AdminUserDto?>
            MapUserAsync(
                ApplicationUser user,
                int currentUserId)
        {
            var roles =
                await _userManager.GetRolesAsync(user);

            string? role = null;

            if (roles.Contains("SuperAdmin"))
            {
                role = "SuperAdmin";
            }
            else if (roles.Contains("Admin"))
            {
                role = "Admin";
            }

            if (role == null)
                return null;

            var isBlocked =
                await _userManager.IsLockedOutAsync(user);

            return new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Patronymic = user.Patronymic,
                PhoneNumber = user.PhoneNumber,
                Role = role,
                IsBlocked = isBlocked,
                IsCurrentUser =
                    user.Id == currentUserId
            };
        }

        private static List<string> ToErrors(
            IdentityResult result)
        {
            return result.Errors
                .Select(error => error.Code)
                .ToList();
        }
    }
}