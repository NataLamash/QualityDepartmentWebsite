using Microsoft.AspNetCore.Identity;
using QualityDepartment.Core.DTOs.Admin.Profile;
using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace QualityDepartment.Infrastructure.Services
{
    public class ProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<AdminProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
                return null;

            return MapProfile(user);
        }

        public async Task<(AdminProfileDto? Profile, List<string> Errors)>
            UpdateProfileAsync(
                int userId,
                UpdateAdminProfileDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                return (
                    null,
                    new List<string> { "USER_NOT_FOUND" }
                );
            }

            var email = dto.Email.Trim();

            var existingUser = await _userManager.FindByEmailAsync(email);

            if (existingUser != null && existingUser.Id != user.Id)
            {
                return (
                    null,
                    new List<string> { "EMAIL_ALREADY_IN_USE" }
                );
            }

            user.LastName = dto.LastName.Trim();
            user.FirstName = dto.FirstName.Trim();

            user.Patronymic = string.IsNullOrWhiteSpace(dto.Patronymic)
                ? null
                : dto.Patronymic.Trim();

            user.PhoneNumber = string.IsNullOrWhiteSpace(dto.PhoneNumber)
                ? null
                : dto.PhoneNumber.Trim();

            IdentityResult updateResult;

            if (!string.Equals(
                    user.Email,
                    email,
                    StringComparison.OrdinalIgnoreCase))
            {
                updateResult = await _userManager.SetEmailAsync(
                    user,
                    email);
            }
            else
            {
                updateResult = await _userManager.UpdateAsync(user);
            }

            if (!updateResult.Succeeded)
            {
                return (
                    null,
                    updateResult.Errors
                        .Select(error => error.Code)
                        .ToList()
                );
            }

            return (
                MapProfile(user),
                new List<string>()
            );
        }

        public async Task<IdentityResult> ChangePasswordAsync(
            int userId,
            ChangePasswordDto dto)
                {
                    var user = await _userManager.FindByIdAsync(
                        userId.ToString());

                    if (user == null)
                    {
                        return IdentityResult.Failed(
                            new IdentityError
                            {
                                Code = "USER_NOT_FOUND",
                                Description = "User not found."
                            });
                    }

                    return await _userManager.ChangePasswordAsync(
                        user,
                        dto.CurrentPassword,
                        dto.NewPassword);
                }

        private static AdminProfileDto MapProfile(
            ApplicationUser user)
        {
            return new AdminProfileDto
            {
                LastName = user.LastName,
                FirstName = user.FirstName,
                Patronymic = user.Patronymic,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber
            };
        }
    }
}