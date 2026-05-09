using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using static QualityDepartment.Core.DTOs.Admin.ExternalLinks.ExternalLinkCreateDto;

namespace QualityDepartment.Core.DTOs.Admin.ExternalLinks
{
    public class ExternalLinkCreateDto : IValidatableObject
    {
        [Required]
        [MaxLength(255)]
        public string NameUa { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string NameEn { get; set; } = null!;

        [Required]
        [Url]
        [MaxLength(500)]
        public string Url { get; set; } = null!;

        [MaxLength(500)]
        public string? ShortDescriptionUa { get; set; }

        [MaxLength(500)]
        public string? ShortDescriptionEn { get; set; }

        public IFormFile? Photo { get; set; }

        public int SortOrder { get; set; }

        public DateTime PublishDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var now = DateTime.UtcNow;

            if (PublishDate < now.AddMinutes(-5)) // Allowing a small buffer for clock differences
            {
                yield return new ValidationResult("DATE_CANNOT_BE_IN_PAST", new[] { nameof(PublishDate) });
            }

            if (PublishDate > now.AddDays(7)) // Arbitrary limit to prevent setting a publish date too far in the future
            {
                yield return new ValidationResult("DATE_TOO_FAR_IN_FUTURE", new[] { nameof(PublishDate) });
            }
        }
    }

    public class ExternalLinkUpdateDto : ExternalLinkCreateDto
    {
        public bool KeepOldPhoto { get; set; } = true;
    }

    public class ExternalLinkAdminListItemDto
    {
        public int Id { get; set; }
        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string? PhotoPath { get; set; }
        public int SortOrder { get; set; }
        public DateTime PublishDate { get; set; }
    }
    public class ExternalLinkAdminDetailsDto : ExternalLinkAdminListItemDto
    {
        public string? ShortDescriptionUa { get; set; }
        public string? ShortDescriptionEn { get; set; }

        public string CreatorName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? EditorName { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
