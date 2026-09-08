using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using QualityDepartment.Core.DTOs.Admin.Auth;
using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace QualityDepartment.Infrastructure.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            IConfiguration config,
            EmailService emailService)
        {
            _userManager = userManager;
            _config = config;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return null;

            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.UserName!,
                Roles = roles.ToList()
            };
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null || string.IsNullOrWhiteSpace(user.Email))
            {
                return;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(
                Encoding.UTF8.GetBytes(token));

            var frontendBaseUrl = _config["AdminFrontend:BaseUrl"];

            if (string.IsNullOrWhiteSpace(frontendBaseUrl))
            {
                throw new InvalidOperationException(
                    "Admin frontend base URL is not configured.");
            }

            var resetUrl =
                $"{frontendBaseUrl.TrimEnd('/')}/reset-password" +
                $"?email={Uri.EscapeDataString(user.Email)}" +
                $"&token={Uri.EscapeDataString(encodedToken)}";

            var encodedResetUrl = WebUtility.HtmlEncode(resetUrl);

            var emailBody = $"""
            <p>Ви отримали цей лист, тому що було запитано відновлення пароля адміністратора.</p>

            <p>
                <a href="{encodedResetUrl}">Змінити пароль</a>
            </p>

            <p>Якщо кнопка не працює, відкрийте це посилання у браузері:</p>

            <p>{encodedResetUrl}</p>

            <p>Якщо ви не запитували відновлення пароля, просто проігноруйте цей лист.</p>
            """;

                await _emailService.SendEmailAsync(
                    user.Email,
                    "Відновлення пароля адміністратора",
                    emailBody);
        }

        public async Task<IdentityResult> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Code = "InvalidToken",
                        Description = "Invalid password reset token."
                    });
            }

            string decodedToken;

            try
            {
                decodedToken = Encoding.UTF8.GetString(
                    WebEncoders.Base64UrlDecode(dto.Token));
            }
            catch (FormatException)
            {
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Code = "InvalidToken",
                        Description = "Invalid password reset token."
                    });
            }

            return await _userManager.ResetPasswordAsync(
                user,
                decodedToken,
                dto.NewPassword);
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpireMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
