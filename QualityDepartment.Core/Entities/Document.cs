using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class Document
    {
        public int Id { get; set; }

        public string FilePath { get; set; } = null!;

        public int CategoryId { get; set; }
        public virtual DocumentCategory? Category { get; set; }

        public DateTime PublishDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public int CreatorId { get; set; }
        public virtual ApplicationUser? Creator { get; set; }
        public int? EditorId { get; set; }
        public virtual ApplicationUser? Editor { get; set; }

        public bool ExternalType { get; set; }

        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public string? DescriptionUa { get; set; }
        public string? DescriptionEn { get; set; }
    }
}
