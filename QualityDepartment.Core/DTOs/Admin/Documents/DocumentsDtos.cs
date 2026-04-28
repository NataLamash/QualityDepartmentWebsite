using Microsoft.AspNetCore.Http;
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
        public IFormFile File { get; set; } = null!;
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
