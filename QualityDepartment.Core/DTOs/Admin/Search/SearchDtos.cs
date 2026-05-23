using QualityDepartment.Core.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace QualityDepartment.Core.DTOs.Admin.Search
{
    public class GlobalSearchResultDto
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public SearchEntityType Type { get; set; }
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? ShortDescription { get; set; }
        public string Link { get; set; } = null!;
        [JsonIgnore]
        public DateTime PublishDate { get; set; }
    }
}
