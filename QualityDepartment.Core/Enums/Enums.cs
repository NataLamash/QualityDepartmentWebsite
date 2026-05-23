using System.Text.Json.Serialization;

namespace QualityDepartment.Core.Enums;

public enum QuestionType
{
    MultipleChoice = 1,
    OpenField = 2
}

public enum FeedbackStatus
{
    New = 1,
    InProgress = 2,
    Resolved = 3
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SearchEntityType
{
    News = 1,
    Event = 2,
    Document = 3,
    InternalAssessment = 4,
    ExternalAssessment = 5,
    ExternalLink = 6
}