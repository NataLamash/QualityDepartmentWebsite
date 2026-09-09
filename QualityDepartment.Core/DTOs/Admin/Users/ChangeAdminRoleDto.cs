using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.DTOs.Admin.Users
{
    public class ChangeAdminRoleDto
    {
        [Required]
        public string Role { get; set; } = null!;
    }
}