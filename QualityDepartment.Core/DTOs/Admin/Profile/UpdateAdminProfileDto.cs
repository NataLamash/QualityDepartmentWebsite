using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.DTOs.Admin.Profile
{
    public class UpdateAdminProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = null!;

        [MaxLength(100)]
        public string? Patronymic { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = null!;

        [MaxLength(32)]
        public string? PhoneNumber { get; set; }
    }
}