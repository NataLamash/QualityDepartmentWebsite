using QualityDepartment.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace QualityDepartment.Core.DTOs.Admin.Search
{
    public class GlobalSearchResultDto
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SearchEntityType Type { get; set; }
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? ShortDescription { get; set; }
        public string Link { get; set; } = null!;
    }
}
