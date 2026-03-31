using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewMigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "ExternalLinks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "461ccee7-25fd-43b3-b8b2-b2e196ce77fe");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "1912dca2-3106-41d3-990b-1b71ec296577");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1fea1856-2788-47a5-9be7-37553e6710d3", "AQAAAAIAAYagAAAAEGQgLhOWOisScwcUrlqtFmu5hmzzaWcnMTAiOwcSlsPXf1Kgb+JNo2vbCsuFW9KRDg==", "2d3398b2-a951-4291-9d92-46bc5ccc9105" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "ExternalLinks");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "24234bb8-f7f7-42d6-93c7-c844e0d48f8d");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "27551409-7e57-4d0d-99d8-b3614e7382ae");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a7cc43f7-45cf-4e18-a599-c252466bacbf", "AQAAAAIAAYagAAAAEH3+HsAfWa1WHKlaCC0Y7B/wchdVTd1YF8JVAisZmMhNM6V6rEd9sslk4/oCLbQTBw==", "a3588f15-91ca-4560-986e-f3fb61397c6e" });
        }
    }
}
