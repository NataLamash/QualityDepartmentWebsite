using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class Survey
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public bool ShowDiagram { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime PublishDate { get; set; }

        public string TitleUa { get; set; } = null!;
        public string TitleEn { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public int CreatorId { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? EditorId { get; set; }
        public virtual ApplicationUser? Editor { get; set; }

        public int CategoryId { get; set; }
        public virtual ApplicationUser? Creator { get; set; }
        public virtual SurveyCategory? Category { get; set; }

        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
