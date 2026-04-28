using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.News
{
    public class NewsAdminDto
    {
        public int Id { get; set; }
        public string TitleUa { get; set; } = null!;
        public string TitleEn { get; set; } = null!;
        public string FullTextUa { get; set; } = null!;
        public string FullTextEn { get; set; } = null!;
        public string? PhotoPath { get; set; }
        public DateTime PublishDate { get; set; }
        public bool IsPublished => PublishDate <= DateTime.UtcNow;
        public string CreatorName { get; set; } = null!;
        public List<TagAdminDto> Tags { get; set; } = new();
    }
}
