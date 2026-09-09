using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace QualityDepartment.Core.Entities
{
    public class ApplicationUser : IdentityUser<int>
    {
        [MaxLength(100)]
        public string? LastName { get; set; }

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? Patronymic { get; set; }

        public virtual ICollection<New> CreatedNews { get; set; } = new List<New>();
        public virtual ICollection<New> EditedNews { get; set; } = new List<New>();
        public virtual ICollection<Survey> CreatedSurveys { get; set; } = new List<Survey>();
        public virtual ICollection<Survey> EditedSurveys { get; set; } = new List<Survey>();
        public virtual ICollection<Document> CreatedDocuments { get; set; } = new List<Document>();
        public virtual ICollection<Document> EditedDocuments { get; set; } = new List<Document>();
        public virtual ICollection<AdministrationMember> CreatedAdministrationMembers { get; set; } = new List<AdministrationMember>();
        public virtual ICollection<AdministrationMember> EditedAdministrationMembers { get; set; } = new List<AdministrationMember>();

        public virtual ICollection<FeedbackMessage> HandledFeedbackMessages { get; set; } = new List<FeedbackMessage>();
        public virtual ICollection<ExternalLink> CreatedExternalLinks { get; set; } = new List<ExternalLink>();
        public virtual ICollection<ExternalLink> EditedExternalLinks { get; set; } = new List<ExternalLink>();

    }
}
