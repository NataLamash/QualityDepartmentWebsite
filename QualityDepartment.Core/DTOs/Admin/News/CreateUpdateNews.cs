using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.News
{
    public class NewsCreateDto : IValidatableObject
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 5)]
        public string TitleUa { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 5)]
        public string TitleEn { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string FullTextUa { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string FullTextEn { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public DateTime PublishDate { get; set; } = DateTime.UtcNow;
        public IFormFile? Photo { get; set; }
        public List<int> TagIds { get; set; } = new();

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

    public class NewsUpdateDto
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 5)]
        public string TitleUa { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 5)]
        public string TitleEn { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string FullTextUa { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public string FullTextEn { get; set; } = null!;

        [Required(ErrorMessage = "FIELD_REQUIRED")]
        public DateTime PublishDate { get; set; }

        public IFormFile? Photo { get; set; }
        public bool KeepOldPhoto { get; set; } = true;
        public List<int> TagIds { get; set; } = new();
    }
}
