using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class UserResponse
    {
        public int Id { get; set; }

        public int SurveyId { get; set; }
        public virtual Survey? Survey { get; set; }

        public DateTime ResponseDate { get; set; }
        public bool IsSubmitted { get; set; }

        public virtual ICollection<ResponseDetail> Details { get; set; } = new List<ResponseDetail>();
    }
}
