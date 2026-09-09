namespace QualityDepartment.Core.DTOs.Admin.Users
{
    public class AdminUserDto
    {
        public int Id { get; set; }

        public string Email { get; set; } = null!;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Patronymic { get; set; }

        public string? PhoneNumber { get; set; }

        public string Role { get; set; } = null!;

        public bool IsBlocked { get; set; }

        public bool IsCurrentUser { get; set; }
    }
}