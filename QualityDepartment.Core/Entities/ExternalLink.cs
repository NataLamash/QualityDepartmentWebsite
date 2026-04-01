using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class ExternalLink
    {
        public int Id { get; set; }

        public string Url { get; set; } = null!;

        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;

        public int SortOrder { get; set; } = 0;

        public DateTime PublishDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public int CreatorId { get; set; }
        public virtual ApplicationUser? Creator { get; set; }
        public int? EditorId { get; set; }
        public virtual ApplicationUser? Editor { get; set; }
    }
}
