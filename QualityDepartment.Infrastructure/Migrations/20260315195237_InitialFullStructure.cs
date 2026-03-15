using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QualityDepartment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialFullStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true),
                    SecurityStamp = table.Column<string>(type: "longtext", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DocumentCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NameUa = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentCategories", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SurveyCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NameUa = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    NameEn = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyCategories", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NameUa = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AdministrationMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FullNameUa = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    FullNameEn = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: true),
                    PositionUa = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: true),
                    PositionEn = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: true),
                    PhotoPath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    SortOrder = table.Column<short>(type: "smallint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EditorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdministrationMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdministrationMembers_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdministrationMembers_AspNetUsers_EditorId",
                        column: x => x.EditorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderKey = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "longtext", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ExternalLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Url = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    NameUa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    NameEn = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PublishDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    EditorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExternalLinks_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExternalLinks_AspNetUsers_EditorId",
                        column: x => x.EditorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FeedbackMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserEmail = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false),
                    MessageText = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    SentDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AdminHandlerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackMessages_AspNetUsers_AdminHandlerId",
                        column: x => x.AdminHandlerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    TitleUa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    TitleEn = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    FullTextUa = table.Column<string>(type: "TEXT", nullable: false),
                    FullTextEn = table.Column<string>(type: "TEXT", nullable: false),
                    PhotoPath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    PublishDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EditorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_News", x => x.Id);
                    table.ForeignKey(
                        name: "FK_News_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_News_AspNetUsers_EditorId",
                        column: x => x.EditorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FilePath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    PublishDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    EditorId = table.Column<int>(type: "int", nullable: true),
                    ExternalType = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    NameUa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    NameEn = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    DescriptionUa = table.Column<string>(type: "TEXT", nullable: true),
                    DescriptionEn = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documents_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Documents_AspNetUsers_EditorId",
                        column: x => x.EditorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Documents_DocumentCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "DocumentCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Surveys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ShowDiagram = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PublishDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TitleUa = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    TitleEn = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EditorId = table.Column<int>(type: "int", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surveys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Surveys_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Surveys_AspNetUsers_EditorId",
                        column: x => x.EditorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Surveys_SurveyCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "SurveyCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "NewsTags",
                columns: table => new
                {
                    NewsId = table.Column<int>(type: "int", nullable: false),
                    TagsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsTags", x => new { x.NewsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_NewsTags_News_NewsId",
                        column: x => x.NewsId,
                        principalTable: "News",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsTags_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    QuestionType = table.Column<int>(type: "int", nullable: false),
                    TextUa = table.Column<string>(type: "TEXT", nullable: false),
                    TextEn = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserResponses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    ResponseDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsSubmitted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserResponses_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AnswerOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    TextUa = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    TextEn = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnswerOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnswerOptions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ResponseDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserResponseId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerOptionId = table.Column<int>(type: "int", nullable: true),
                    TextAnswer = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResponseDetails_AnswerOptions_AnswerOptionId",
                        column: x => x.AnswerOptionId,
                        principalTable: "AnswerOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResponseDetails_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResponseDetails_UserResponses_UserResponseId",
                        column: x => x.UserResponseId,
                        principalTable: "UserResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { 1, "53fa882b-57ea-4682-b678-0e4abb2251bf", "Admin", "ADMIN" },
                    { 2, "4c56e6ca-d0b3-4119-9832-744d781dc95c", "SuperAdmin", "SUPERADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { 1, 0, "234e340e-4263-4aec-b42a-ff18fb440b82", "admin@knu.ua", true, false, null, "ADMIN@KNU.UA", "VZAO_ADMIN", "AQAAAAIAAYagAAAAEKX2lZiZHsYAvK1DyyT5JAPXy870DnjVFeUoK4m83Ulz/aASxnysz4duNQAxJwqAug==", null, false, "42926d83-a0a6-414c-94bd-e906f8919eea", false, "vzao_admin" });

            migrationBuilder.InsertData(
                table: "DocumentCategories",
                columns: new[] { "Id", "NameEn", "NameUa" },
                values: new object[,]
                {
                    { 1, "Regulatory Framework", "Нормативна база" },
                    { 2, "Surveys", "Анкетування" },
                    { 3, "Reports", "Звіти" }
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "NameEn", "NameUa" },
                values: new object[,]
                {
                    { 1, "Announcement", "Анонс" },
                    { 2, "Important", "Важливо" },
                    { 3, "Survey", "Опитування" }
                });

            migrationBuilder.InsertData(
                table: "AdministrationMembers",
                columns: new[] { "Id", "CreatedAt", "CreatorId", "EditorId", "FullNameEn", "FullNameUa", "PhotoPath", "PositionEn", "PositionUa", "SortOrder", "UpdatedAt" },
                values: new object[] { 1, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, "Olena Koval", "Коваль Олена Петрівна", null, "Head of Quality Assurance Department", "Керівник відділу забезпечення якості освіти", (short)1, null });

            migrationBuilder.InsertData(
                table: "Documents",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "CreatorId", "DescriptionEn", "DescriptionUa", "EditorId", "ExternalType", "FilePath", "NameEn", "NameUa", "PublishDate", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, null, false, "/uploads/docs/regulation_v1.pdf", "Regulation on QA System", "Положення про ВЗЯО", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null },
                    { 2, 1, new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, null, false, "/uploads/docs/integrity_code.pdf", "Code of Academic Integrity", "Кодекс академічної доброчесності", new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null },
                    { 3, 3, new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, null, null, false, "/uploads/docs/report_2025.pdf", "Annual Report 2025", "Звіт за 2025 рік", new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), null }
                });

            migrationBuilder.InsertData(
                table: "News",
                columns: new[] { "Id", "CreatedAt", "CreatorId", "EditorId", "FullTextEn", "FullTextUa", "PhotoPath", "PublishDate", "TitleEn", "TitleUa", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, "We are pleased to announce the successful testing of the new system...", "Ми раді повідомити про успішне тестування нової системи ВЗЯО...", null, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Launch of the Updated Quality Portal", "Запуск оновленого порталу якості", null },
                    { 2, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, "We invite teachers and students to discuss new standards...", "Запрошуємо викладачів та студентів на обговорення нових стандартів...", null, new DateTime(2026, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Webinar: Academic Integrity", "Вебінар: Академічна доброчесність", null },
                    { 3, new DateTime(2026, 3, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, "Your opinion matters! Take a survey about teaching quality...", "Ваша думка важлива! Пройдіть опитування щодо якості викладання...", null, new DateTime(2026, 3, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Start of the Annual Student Survey", "Старт щорічного опитування студентів", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdministrationMembers_CreatorId",
                table: "AdministrationMembers",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_AdministrationMembers_EditorId",
                table: "AdministrationMembers",
                column: "EditorId");

            migrationBuilder.CreateIndex(
                name: "IX_AdministrationMembers_SortOrder",
                table: "AdministrationMembers",
                column: "SortOrder");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerOptions_QuestionId",
                table: "AnswerOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_CategoryId",
                table: "Documents",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_CreatorId",
                table: "Documents",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_EditorId",
                table: "Documents",
                column: "EditorId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_PublishDate",
                table: "Documents",
                column: "PublishDate");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalLinks_CreatorId",
                table: "ExternalLinks",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalLinks_EditorId",
                table: "ExternalLinks",
                column: "EditorId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalLinks_PublishDate",
                table: "ExternalLinks",
                column: "PublishDate");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackMessages_AdminHandlerId",
                table: "FeedbackMessages",
                column: "AdminHandlerId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackMessages_SentDate",
                table: "FeedbackMessages",
                column: "SentDate");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackMessages_Status",
                table: "FeedbackMessages",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_News_CreatorId",
                table: "News",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_News_EditorId",
                table: "News",
                column: "EditorId");

            migrationBuilder.CreateIndex(
                name: "IX_News_PublishDate",
                table: "News",
                column: "PublishDate");

            migrationBuilder.CreateIndex(
                name: "IX_NewsTags_TagsId",
                table: "NewsTags",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_SurveyId",
                table: "Questions",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseDetails_AnswerOptionId",
                table: "ResponseDetails",
                column: "AnswerOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseDetails_QuestionId",
                table: "ResponseDetails",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ResponseDetails_UserResponseId",
                table: "ResponseDetails",
                column: "UserResponseId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_CategoryId",
                table: "Surveys",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_CreatorId",
                table: "Surveys",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_EditorId",
                table: "Surveys",
                column: "EditorId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_IsActive",
                table: "Surveys",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_PublishDate",
                table: "Surveys",
                column: "PublishDate");

            migrationBuilder.CreateIndex(
                name: "IX_UserResponses_SurveyId",
                table: "UserResponses",
                column: "SurveyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdministrationMembers");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "ExternalLinks");

            migrationBuilder.DropTable(
                name: "FeedbackMessages");

            migrationBuilder.DropTable(
                name: "NewsTags");

            migrationBuilder.DropTable(
                name: "ResponseDetails");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "DocumentCategories");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "AnswerOptions");

            migrationBuilder.DropTable(
                name: "UserResponses");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Surveys");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "SurveyCategories");
        }
    }
}
