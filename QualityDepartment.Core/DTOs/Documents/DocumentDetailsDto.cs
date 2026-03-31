using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Documents
{
    public class DocumentDetailsDto: DocumentListItemDto
    {

        public string FileType { get; set; } = string.Empty; 
        public string FileSize { get; set; } 
        public string Lang { get; set; } = "ua";
    }
}
