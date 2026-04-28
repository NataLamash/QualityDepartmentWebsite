using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.Administration
{
    public class AdministrationMemberAdminDto
    {
        public int Id { get; set; }
        public string FullNameUa { get; set; } = null!;
        public string? PositionUa { get; set; }
        public string? PhotoPath { get; set; }
        public short? SortOrder { get; set; }
    }

    public class AdministrationMemberAdminDetailsDto : AdministrationMemberAdminDto
    {
        public string FullNameEn { get; set; } = null!;
        public string? PositionEn { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdministrationMemberCreateDto
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 3)]
        public string FullNameUa { get; set; } = null!;
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 3)]
        public string FullNameEn { get; set; } = null!;
        [StringLength(255)]
        public string? PositionUa { get; set; }
        [StringLength(255)]
        public string? PositionEn { get; set; }
        public IFormFile? Photo { get; set; }
    }

    public class AdministrationMemberUpdateDto 
    {
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 3)]
        public string FullNameUa { get; set; } = null!;
        [Required(ErrorMessage = "FIELD_REQUIRED")]
        [StringLength(255, MinimumLength = 3)]
        public string FullNameEn { get; set; } = null!;
        [StringLength(255)]
        public string? PositionUa { get; set; }
        [StringLength(255)]
        public string? PositionEn { get; set; }
        public IFormFile? Photo { get; set; }
        public string? ExistingPhotoPath { get; set; }
    }

    public class AdministrationMemberReorderDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int TargetPosition { get; set; }
    }
}
