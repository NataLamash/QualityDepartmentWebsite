using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class AnswerOption
    {
        public int Id { get; set; }

        public int QuestionId { get; set; }
        public virtual Question? Question { get; set; }

        public string TextUa { get; set; } = null!;
        public string TextEn { get; set; } = null!;

        public virtual ICollection<ResponseDetail> ResponseDetails { get; set; } = new List<ResponseDetail>();
    }
}
