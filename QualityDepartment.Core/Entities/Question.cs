using System;
using System.Collections.Generic;
using System.Text;
using QualityDepartment.Core.Enums;

namespace QualityDepartment.Core.Entities
{
    public class Question
    {
        public int Id { get; set; }

        public int SurveyId { get; set; }
        public virtual Survey? Survey { get; set; }

        public QuestionType QuestionType { get; set; }
        public string TextUa { get; set; } = null!;
        public string TextEn { get; set; } = null!;

        public virtual ICollection<AnswerOption> AnswerOptions { get; set; } = new List<AnswerOption>();
        public virtual ICollection<ResponseDetail> ResponseDetails { get; set; } = new List<ResponseDetail>();
    }
}
