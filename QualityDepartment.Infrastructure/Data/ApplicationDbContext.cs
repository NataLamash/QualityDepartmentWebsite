using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.Entities;

namespace QualityDepartment.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<New> News => Set<New>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentCategory> DocumentCategories => Set<DocumentCategory>();
    public DbSet<ExternalLink> ExternalLinks => Set<ExternalLink>();
    public DbSet<Survey> Surveys => Set<Survey>();
    public DbSet<SurveyCategory> SurveyCategories => Set<SurveyCategory>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<AnswerOption> AnswerOptions => Set<AnswerOption>();
    public DbSet<UserResponse> UserResponses => Set<UserResponse>();
    public DbSet<ResponseDetail> ResponseDetails => Set<ResponseDetail>();
    public DbSet<FeedbackMessage> FeedbackMessages => Set<FeedbackMessage>();
    public DbSet<AdministrationMember> AdministrationMembers => Set<AdministrationMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<New>(entity =>
        {
            entity.Property(e => e.TitleUa).HasMaxLength(255).IsRequired();
            entity.Property(e => e.TitleEn).HasMaxLength(255).IsRequired();
            entity.Property(e => e.FullTextUa).HasColumnType("TEXT").IsRequired();
            entity.Property(e => e.FullTextEn).HasColumnType("TEXT").IsRequired();
            entity.Property(e => e.PhotoPath)
                  .HasMaxLength(500)
                  .IsRequired(false);
            entity.HasIndex(e => e.PublishDate);

            entity.HasOne(e => e.Creator)
                  .WithMany(u => u.CreatedNews)
                  .HasForeignKey(e => e.CreatorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Editor)
                  .WithMany(u => u.EditedNews)
                  .HasForeignKey(e => e.EditorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AdministrationMember>(entity =>
        {
            entity.Property(e => e.FullNameUa).HasMaxLength(150).IsRequired();
            entity.Property(e => e.FullNameEn).HasMaxLength(150).IsRequired(false);
            entity.Property(e => e.SortOrder).HasColumnType("smallint");
            entity.HasIndex(e => e.SortOrder);
            entity.Property(e => e.PhotoPath)
                  .HasMaxLength(500)
                  .IsRequired(false);
            entity.Property(e => e.PositionUa)
                  .HasMaxLength(250)
                  .IsRequired(false);

            entity.Property(e => e.PositionEn)
                  .HasMaxLength(250)
                  .IsRequired(false);

            entity.HasOne(e => e.Creator)
                  .WithMany(u => u.CreatedAdministrationMembers)
                  .HasForeignKey(e => e.CreatorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Editor)
                  .WithMany(u => u.EditedAdministrationMembers)
                  .HasForeignKey(e => e.EditorId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<FeedbackMessage>(entity =>
        {
            entity.Property(e => e.UserEmail).HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.SentDate);
            entity.Property(e => e.MessageText)
                  .HasColumnType("TEXT")
                  .HasMaxLength(2000)
                  .IsRequired();

            entity.HasOne(e => e.AdminHandler)
                  .WithMany(u => u.HandledFeedbackMessages)
                  .HasForeignKey(e => e.AdminHandlerId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Survey>(entity =>
        {
            entity.Property(e => e.TitleUa).HasMaxLength(255).IsRequired();
            entity.Property(e => e.TitleEn).HasMaxLength(255).IsRequired();

            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.PublishDate);

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Surveys)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Creator)
                  .WithMany(u => u.CreatedSurveys)
                  .HasForeignKey(e => e.CreatorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Editor)
                  .WithMany(u => u.EditedSurveys)
                  .HasForeignKey(e => e.EditorId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<New>()
            .HasMany(n => n.Tags)
            .WithMany(t => t.News)
            .UsingEntity(j => j.ToTable("NewsTags"));

        modelBuilder.Entity<Document>(entity =>
        {
            entity.Property(e => e.NameUa).HasMaxLength(255).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(255).IsRequired();
            entity.Property(e => e.FilePath).HasMaxLength(500).IsRequired();

            entity.Property(e => e.DescriptionUa)
                  .HasColumnType("TEXT")
                  .IsRequired(false);

            entity.Property(e => e.DescriptionEn)
                  .HasColumnType("TEXT")
                  .IsRequired(false);

            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.PublishDate);

            entity.HasOne(d => d.Category)
                  .WithMany(c => c.Documents)
                  .HasForeignKey(d => d.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Creator)
                  .WithMany(u => u.CreatedDocuments)
                  .HasForeignKey(d => d.CreatorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Editor)
                  .WithMany(u => u.EditedDocuments)
                  .HasForeignKey(d => d.EditorId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ExternalLink>(entity =>
        {
            entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
            entity.Property(e => e.NameUa).HasMaxLength(255).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(255).IsRequired();

            entity.HasIndex(e => e.PublishDate);

            entity.HasOne(e => e.Creator)
                  .WithMany(u => u.CreatedExternalLinks)
                  .HasForeignKey(e => e.CreatorId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Editor)
                  .WithMany(u => u.EditedExternalLinks)
                  .HasForeignKey(e => e.EditorId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.Property(e => e.TextUa).HasColumnType("TEXT").IsRequired();
            entity.Property(e => e.TextEn).HasColumnType("TEXT").IsRequired();

            entity.HasOne(q => q.Survey)
                  .WithMany(s => s.Questions)
                  .HasForeignKey(q => q.SurveyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AnswerOption>(entity =>
        {
            entity.Property(e => e.TextUa).HasMaxLength(500).IsRequired();
            entity.Property(e => e.TextEn).HasMaxLength(500).IsRequired();

            entity.HasOne(a => a.Question)
                  .WithMany(q => q.AnswerOptions)
                  .HasForeignKey(a => a.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ResponseDetail>(entity =>
        {
            entity.Property(e => e.TextAnswer).HasColumnType("TEXT").IsRequired(false);

            entity.HasOne(rd => rd.UserResponse)
                  .WithMany(ur => ur.Details)
                  .HasForeignKey(rd => rd.UserResponseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rd => rd.Question)
                  .WithMany(q => q.ResponseDetails)
                  .HasForeignKey(rd => rd.QuestionId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(rd => rd.AnswerOption)
                  .WithMany(ao => ao.ResponseDetails)
                  .HasForeignKey(rd => rd.AnswerOptionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<UserResponse>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(ur => ur.Survey)
                  .WithMany(s => s.UserResponses)
                  .HasForeignKey(ur => ur.SurveyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.Property(e => e.NameUa).HasMaxLength(100).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<SurveyCategory>(entity =>
        {
            entity.Property(e => e.NameUa).HasMaxLength(150).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(150).IsRequired();
        });

        modelBuilder.Entity<DocumentCategory>(entity =>
        {
            entity.Property(e => e.NameUa).HasMaxLength(200).IsRequired();
            entity.Property(e => e.NameEn).HasMaxLength(200).IsRequired();
        });



        SeedInitialData(modelBuilder);
    }

    private void SeedInitialData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityRole<int>>().HasData(
            new IdentityRole<int> { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole<int> { Id = 2, Name = "SuperAdmin", NormalizedName = "SUPERADMIN" }
        );

        var hasher = new PasswordHasher<ApplicationUser>();
        modelBuilder.Entity<ApplicationUser>().HasData(new ApplicationUser
        {
            Id = 1,
            UserName = "vzao_admin",
            NormalizedUserName = "VZAO_ADMIN",
            Email = "admin@knu.ua",
            NormalizedEmail = "ADMIN@KNU.UA",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            PasswordHash = hasher.HashPassword(null!, "Admin123!")
        });

        modelBuilder.Entity<DocumentCategory>().HasData(
            new DocumentCategory { Id = 1, NameUa = "Нормативна база", NameEn = "Regulatory Framework" },
            new DocumentCategory { Id = 2, NameUa = "Анкетування", NameEn = "Surveys" },
            new DocumentCategory { Id = 3, NameUa = "Звіти", NameEn = "Reports" }
        );

        modelBuilder.Entity<Tag>().HasData(
            new Tag { Id = 1, NameUa = "Анонс", NameEn = "Announcement" },
            new Tag { Id = 2, NameUa = "Важливо", NameEn = "Important" },
            new Tag { Id = 3, NameUa = "Опитування", NameEn = "Survey" }
        );

        modelBuilder.Entity<AdministrationMember>().HasData(
            new AdministrationMember
            {
                Id = 1,
                FullNameUa = "Коваль Олена Петрівна",
                FullNameEn = "Olena Koval",
                PositionUa = "Керівник відділу забезпечення якості освіти",
                PositionEn = "Head of Quality Assurance Department",
                SortOrder = 1,
                CreatedAt = new DateTime(2026, 3, 1),
                CreatorId = 1
            }
        );

        modelBuilder.Entity<New>().HasData(
            new New
            {
                Id = 1,
                TitleUa = "Запуск оновленого порталу якості",
                TitleEn = "Launch of the Updated Quality Portal",
                FullTextUa = "Ми раді повідомити про успішне тестування нової системи ВЗЯО...",
                FullTextEn = "We are pleased to announce the successful testing of the new system...",
                PublishDate = new DateTime(2026, 3, 15),
                CreatedAt = new DateTime(2026, 3, 14),
                CreatorId = 1
            },
            new New
            {
                Id = 2,
                TitleUa = "Вебінар: Академічна доброчесність",
                TitleEn = "Webinar: Academic Integrity",
                FullTextUa = "Запрошуємо викладачів та студентів на обговорення нових стандартів...",
                FullTextEn = "We invite teachers and students to discuss new standards...",
                PublishDate = new DateTime(2026, 3, 20),
                CreatedAt = new DateTime(2026, 3, 15),
                CreatorId = 1
            },
            new New
            {
                Id = 3,
                TitleUa = "Старт щорічного опитування студентів",
                TitleEn = "Start of the Annual Student Survey",
                FullTextUa = "Ваша думка важлива! Пройдіть опитування щодо якості викладання...",
                FullTextEn = "Your opinion matters! Take a survey about teaching quality...",
                PublishDate = new DateTime(2026, 3, 25),
                CreatedAt = new DateTime(2026, 3, 16),
                CreatorId = 1
            }
        );

        modelBuilder.Entity<Document>().HasData(
            new Document
            {
                Id = 1,
                NameUa = "Положення про ВЗЯО",
                NameEn = "Regulation on QA System",
                FilePath = "/uploads/docs/regulation_v1.pdf",
                CategoryId = 1,
                ExternalType = false,
                PublishDate = new DateTime(2026, 1, 1),
                CreatedAt = new DateTime(2026, 1, 1),
                CreatorId = 1
            },
            new Document
            {
                Id = 2,
                NameUa = "Кодекс академічної доброчесності",
                NameEn = "Code of Academic Integrity",
                FilePath = "/uploads/docs/integrity_code.pdf",
                CategoryId = 1,
                ExternalType = false,
                PublishDate = new DateTime(2026, 2, 1),
                CreatedAt = new DateTime(2026, 2, 1),
                CreatorId = 1
            },
            new Document
            {
                Id = 3,
                NameUa = "Звіт за 2025 рік",
                NameEn = "Annual Report 2025",
                FilePath = "/uploads/docs/report_2025.pdf",
                CategoryId = 3,
                ExternalType = false,
                PublishDate = new DateTime(2026, 3, 5),
                CreatedAt = new DateTime(2026, 3, 5),
                CreatorId = 1
            }
        );
    }
}