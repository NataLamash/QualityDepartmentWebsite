using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImageAndDescriptionToExternalLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoPath",
                table: "ExternalLinks",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShortDescriptionEn",
                table: "ExternalLinks",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShortDescriptionUa",
                table: "ExternalLinks",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoPath",
                table: "ExternalLinks");

            migrationBuilder.DropColumn(
                name: "ShortDescriptionEn",
                table: "ExternalLinks");

            migrationBuilder.DropColumn(
                name: "ShortDescriptionUa",
                table: "ExternalLinks");
        }
    }
}
