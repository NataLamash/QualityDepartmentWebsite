using Microsoft.AspNetCore.Http;
using QualityDepartment.Core.DTOs.Admin.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.Documents
{
    public class DocumentAdminDto
    {
        public int Id { get; set; }
        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public int CategoryId { get; set; }
        public string CategoryNameUa { get; set; } = null!;
        public string CategoryNameEn { get; set; } = null!;
        public DateTime PublishDate { get; set; }
        public bool ExternalType { get; set; }
        public string FilePath { get; set; } = null!;
    }

    public class DocumentAdminDetailsDto : DocumentAdminDto
    {
        public string? DescriptionUa { get; set; }
        public string? DescriptionEn { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? CreatorName { get; set; }
        public string? EditorName { get; set; }
    }

    public class DocumentCreateDto
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string NameUa { get; set; } = null!;
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string NameEn { get; set; } = null!;
        public string? DescriptionUa { get; set; }
        public string? DescriptionEn { get; set; }

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "FIELD_REQUIRED")]

        public DateTime PublishDate { get; set; }

        public bool ExternalType { get; set; }

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [AllowedExtensions(new[] { ".pdf"})]
        public IFormFile File { get; set; } = null!;

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

    public class DocumentUpdateDto
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string NameUa { get; set; } = null!;
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string NameEn { get; set; } = null!;
        public string? DescriptionUa { get; set; }
        public string? DescriptionEn { get; set; }

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public DateTime PublishDate { get; set; }

        public bool ExternalType { get; set; }
        public IFormFile? File { get; set; }
    }
}
