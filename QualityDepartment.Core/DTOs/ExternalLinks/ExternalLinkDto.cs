using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.ExternalLinks
{
    public class ExternalLinkDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = null!;
        public string Name { get; set; } = null!;
        public DateTime PublishDate { get; set; }
        public int SortOrder { get; set; }
    }
}
