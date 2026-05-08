using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.News
{
    public class NewsAdminDetailsDto
    {
        public int Id { get; set; }

        public string TitleUa { get; set; } = null!;
        public string TitleEn { get; set; } = null!;

        public string FullTextUa { get; set; } = null!;
        public string FullTextEn { get; set; } = null!;

        public string? PhotoPath { get; set; }

        public DateTime PublishDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public int CreatorId { get; set; }
        public string? CreatorName { get; set; }

        public int? EditorId { get; set; }
        public string? EditorName { get; set; }

        public List<TagAdminDto> Tags { get; set; } = new();
    }

    public class TagAdminDto
    {
        public int Id { get; set; }
        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
    }
}
