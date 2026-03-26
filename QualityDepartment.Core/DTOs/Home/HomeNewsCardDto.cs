using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Home
{
    public class HomeNewsCardDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime PublishDate { get; set; }
        public string? PhotoPath { get; set; }
        public string ShortInfo { get; set; } = null!;
    }
}
