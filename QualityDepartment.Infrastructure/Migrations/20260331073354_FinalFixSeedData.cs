using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalFixSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                values: new object[] { "672eb5c1-ecdf-4ed6-a5bb-07bbc1b1bf15", "AQAAAAIAAYagAAAAEGjthsKhOUSp3G03HRX9BAr1z7mpyb50xhBHWx94BDJsVpnJKMGRw+UpxEBFqY2EgA==", "B4628F5F-0A12-4C7A-A1F2-D5E397B1A990" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
