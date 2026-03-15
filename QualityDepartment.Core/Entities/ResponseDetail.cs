using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class ResponseDetail
    {
        public int Id { get; set; }

        public int UserResponseId { get; set; }
        public virtual UserResponse? UserResponse { get; set; }

        public int QuestionId { get; set; }
        public virtual Question? Question { get; set; }

        public int? AnswerOptionId { get; set; }
        public virtual AnswerOption? AnswerOption { get; set; }

        public string? TextAnswer { get; set; }
    }
}
