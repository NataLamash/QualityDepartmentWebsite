using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.News
{
    public class NewsCreateDto
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
        public List<int> TagIds { get; set; } = new();
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
        public string? ExistingPhotoPath { get; set; }
        public List<int> TagIds { get; set; } = new();
    }
}
