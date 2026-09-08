using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.DTOs.Admin.Auth
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}