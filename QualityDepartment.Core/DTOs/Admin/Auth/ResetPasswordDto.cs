using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.DTOs.Admin.Auth
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Token { get; set; } = null!;

        [Required]
        public string NewPassword { get; set; } = null!;
    }
}