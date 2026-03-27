using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Home
{
    public class AdministrationMemberCardDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Position { get; set; }
        public string? PhotoPath { get; set; }
        public short SortOrder { get; set; }
    }
}
