using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.TagsAndCategories
{
    public class TagDto 
    { 
        public int Id { get; set; } 
        public string Name { get; set; } = null!; 
    }
    public class TagCreateUpdateDto 
    { 
        public string NameUa { get; set; } = null!; 
        public string NameEn { get; set; } = null!; 
    }

    public class CategoryDto 
    { 
        public int Id { get; set; } 
        public string Name { get; set; } = null!; 
    }
    public class CategoryCreateUpdateDto 
    { 
        public string NameUa { get; set; } = null!; 
        public string NameEn { get; set; } = null!; 
    }

    public class AdminTagDto
    {
        public int Id { get; set; }

        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;

        public int NewsCount { get; set; }
    }

    public class CategoryAdminDto
    {
        public int Id { get; set; }

        public string NameUa { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public int DocumentsCount { get; set; }
    }
}
