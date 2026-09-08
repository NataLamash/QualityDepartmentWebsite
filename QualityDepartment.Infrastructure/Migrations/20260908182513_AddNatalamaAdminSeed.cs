using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNatalamaAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { 3, 0, "E7523B11-2B5C-4476-A1A5-F203C35C2F14", "natalama1204@gmail.com", true, false, null, "NATALAMA1204@GMAIL.COM", "NATALAMA1204", "AQAAAAIAAYagAAAAEGjthsKhOUSp3G03HRX9BAr1z7mpyb50xhBHWx94BDJsVpnJKMGRw+UpxEBFqY2EgA==", null, false, "A841DB52-91C4-4B62-92D8-72D1B47C3185", false, "natalama1204" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { 1, 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, 3 });

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
