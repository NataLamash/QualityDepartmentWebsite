namespace QualityDepartment.Core.DTOs.Admin.Profile
{
    public class AdminProfileDto
    {
        public string? LastName { get; set; }

        public string? FirstName { get; set; }

        public string? Patronymic { get; set; }

        public string Email { get; set; } = null!;

        public string? PhoneNumber { get; set; }
    }
}