using QualityDepartment.Core.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.News
{
    public class NewsDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string FullText { get; set; } = null!;
        public DateTime PublishDate { get; set; }
        public string? PhotoPath { get; set; }
        public string Language { get; set; } = null!;
        public List<LookupDto> Tags { get; set; } = new();
    }
}
