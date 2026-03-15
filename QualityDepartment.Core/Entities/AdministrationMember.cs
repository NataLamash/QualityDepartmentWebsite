using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class AdministrationMember
    {
        public int Id { get; set; }
        public string FullNameUa { get; set; } = null!;
        public string FullNameEn { get; set; } = null!;
        public string? PositionUa { get; set; }
        public string? PositionEn { get; set; }
        public string? PhotoPath { get; set; }

        public short SortOrder { get; set; }

        public DateTime CreatedAt { get; set; }
        public int CreatorId { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public int? EditorId { get; set; }

        public virtual ApplicationUser? Creator { get; set; }
        public virtual ApplicationUser? Editor { get; set; }
    }
}
