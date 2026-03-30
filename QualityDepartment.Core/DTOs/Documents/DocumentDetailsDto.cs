using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Documents
{
    public class DocumentDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public DateTime PublishDate { get; set; }
        public string FilePath { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty; 
        public string FileSize { get; set; } 
        public string Lang { get; set; } = "ua";
        public bool ExternalType { get; set; }
    }
}
