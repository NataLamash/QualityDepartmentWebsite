using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SyncModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SortOrder",
                table: "ExternalLinks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "7c9a42de-b6f7-475e-a9d9-219355580e66");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "34abda56-1eb3-45a2-ba07-c58b81ed6ddb");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b23eb88b-e2eb-41da-a8d8-f0286c2676ce", "AQAAAAIAAYagAAAAEPdQMnlseFJ36nabOGntfIKuDnlSAew5p6ArcPA8CSVbE8VJsDIzZHLy0Ws6c1fVbA==", "9970f632-81a9-4173-92a5-1ce8f272c35e" });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalLinks_SortOrder",
                table: "ExternalLinks",
                column: "SortOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ExternalLinks_SortOrder",
                table: "ExternalLinks");

            migrationBuilder.AlterColumn<int>(
                name: "SortOrder",
                table: "ExternalLinks",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

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
    }
}
