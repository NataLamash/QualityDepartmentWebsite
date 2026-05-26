using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Documents
{
    public class BaseDocumentParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string? Search { get; set; }
        public string Sort { get; set; } = "dateDesc";
        public string Lang { get; set; } = "ua";
    }

    public class DocumentParams : BaseDocumentParams
    {
        public List<int>? CategoryIds { get; set; } = null;
    }
}