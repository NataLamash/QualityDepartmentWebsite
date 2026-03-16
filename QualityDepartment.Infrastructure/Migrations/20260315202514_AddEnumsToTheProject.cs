using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnumsToTheProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "QuestionType",
                table: "Questions",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "FeedbackMessages",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "QuestionType",
                table: "Questions",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "FeedbackMessages",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "53fa882b-57ea-4682-b678-0e4abb2251bf");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "4c56e6ca-d0b3-4119-9832-744d781dc95c");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "234e340e-4263-4aec-b42a-ff18fb440b82", "AQAAAAIAAYagAAAAEKX2lZiZHsYAvK1DyyT5JAPXy870DnjVFeUoK4m83Ulz/aASxnysz4duNQAxJwqAug==", "42926d83-a0a6-414c-94bd-e906f8919eea" });
        }
    }
}
