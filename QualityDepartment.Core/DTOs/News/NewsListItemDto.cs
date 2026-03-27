using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.News
{
    public class NewsListItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime PublishDate { get; set; }
        public string? PhotoPath { get; set; }
    }
}
