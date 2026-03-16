using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.Entities
{
    public class DocumentCategory
    {
        public int Id { get; set; }
        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}
