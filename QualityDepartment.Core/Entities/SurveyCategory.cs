using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class SurveyCategory
    {
        public int Id { get; set; }
        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public virtual ICollection<Survey> Surveys { get; set; } = new List<Survey>();
    }
}
