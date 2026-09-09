using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.DTOs.Admin.Profile
{
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = null!;

        [Required]
        public string NewPassword { get; set; } = null!;
    }
}