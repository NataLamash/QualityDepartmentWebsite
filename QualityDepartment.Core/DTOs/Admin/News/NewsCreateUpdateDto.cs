using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.News
{
    public class NewsCreateUpdateDto
    {
        [Required(ErrorMessage = "Заголовок (UA) обов'язковий")]
        [StringLength(255, MinimumLength = 5)]
        public string TitleUa { get; set; } = null!;

        [Required(ErrorMessage = "Заголовок (EN) обов'язковий")]
        [StringLength(255)]
        public string TitleEn { get; set; } = null!;

        [Required(ErrorMessage = "Текст новини обов'язковий")]
        public string FullTextUa { get; set; } = null!;

        public string FullTextEn { get; set; } = null!;
        public string? PhotoPath { get; set; }
        public DateTime PublishDate { get; set; }

        public IFormFile? Photo { get; set; }
        public string? ExistingPhotoPath { get; set; }
    }
}
