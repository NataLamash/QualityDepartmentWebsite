using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class New
    {
        public int Id { get; set; }
        public string TitleUa { get; set; } = null!;
        public string TitleEn { get; set; } = null!;
        public string FullTextUa { get; set; } = null!;
        public string FullTextEn { get; set; } = null!;
        public string? PhotoPath { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatorId { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? EditorId { get; set; }

        public virtual ApplicationUser? Creator { get; set; }
        public virtual ApplicationUser? Editor { get; set; }
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}
