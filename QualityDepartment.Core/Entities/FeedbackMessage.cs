using System;
using System.Collections.Generic;
using System.Text;
using QualityDepartment.Core.Enums;

namespace QualityDepartment.Core.Entities
{
    public class FeedbackMessage
    {
        public int Id { get; set; }
        public string UserEmail { get; set; } = null!;
        public string MessageText { get; set; } = null!;
        public DateTime SentDate { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public FeedbackStatus Status { get; set; }

        public int? AdminHandlerId { get; set; }
        public virtual ApplicationUser? AdminHandler { get; set; }
    }
}
