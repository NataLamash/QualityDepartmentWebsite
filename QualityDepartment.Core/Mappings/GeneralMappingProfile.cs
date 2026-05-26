using AutoMapper;
using QualityDepartment.Core.DTOs.Admin.Administration;
using QualityDepartment.Core.DTOs.Admin.Documents;
using QualityDepartment.Core.DTOs.Admin.ExternalLinks;
using QualityDepartment.Core.DTOs.Admin.News;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Core.DTOs.ExternalLinks;
using QualityDepartment.Core.DTOs.Home;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;


namespace QualityDepartment.Core.Mappings
{
    public class GeneralMappingProfile: Profile
    {
        public GeneralMappingProfile() 
        {
            CreateMap<New, NewsListItemDto>()
            .ForMember(
                dest => dest.Title,
                opt => opt.MapFrom((src, dest, destMember, context) =>
                    GetLocalizedValue(src.TitleUa, src.TitleEn, context)))
            .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate))
            .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.PhotoPath))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));

            CreateMap<New, NewsDetailsDto>()
                .ForMember(
                    dest => dest.Title,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        GetLocalizedValue(src.TitleUa, src.TitleEn, context)))
                .ForMember(
                    dest => dest.FullText,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        GetLocalizedValue(src.FullTextUa, src.FullTextEn, context)))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate))
                .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.PhotoPath))
                .ForMember(
                    dest => dest.Language,
                    opt => opt.MapFrom((src, dest, destMember, context) => GetLanguage(context)))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));

            CreateMap<Tag, LookupDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom((src, dest, destMember, context) =>
                    GetLocalizedValue(src.NameUa, src.NameEn, context)));

            CreateMap<New, HomeNewsCardDto>()
                .ForMember(
                    dest => dest.Title,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        GetLocalizedValue(src.TitleUa, src.TitleEn, context)))
                .ForMember(
                    dest => dest.ShortInfo,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        BuildShortInfo(GetLocalizedValue(src.FullTextUa, src.FullTextEn, context))))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate))
                .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.PhotoPath));

            CreateMap<NewsCreateDto, New>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore());

            CreateMap<NewsUpdateDto, New>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore());

            CreateMap<Tag, TagAdminDto>();

            CreateMap<New, NewsAdminDto>()
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator!.UserName));
            CreateMap<New, NewsAdminDto>()
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator!.UserName));


            CreateMap<New, NewsAdminDetailsDto>()
                .ForMember(dest => dest.CreatorName,
                    opt => opt.MapFrom(src => src.Creator.UserName))

                .ForMember(dest => dest.EditorName,
                    opt => opt.MapFrom(src => src.Editor != null ? src.Editor.UserName : null))

                .ForMember(dest => dest.Tags,
                    opt => opt.MapFrom(src => src.Tags));

            CreateMap<AdministrationMember, AdministrationMemberCardDto>()
                .ForMember(
                    dest => dest.FullName,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        GetLocalizedValue(src.FullNameUa, src.FullNameEn, context)))
                .ForMember(
                    dest => dest.Position,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                        GetLocalizedValue(src.PositionUa, src.PositionEn, context)))
                .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.PhotoPath))
                .ForMember(dest => dest.SortOrder, opt => opt.MapFrom(src => src.SortOrder));

            CreateMap<AdministrationMember, AdministrationMemberAdminDto>();
            CreateMap<AdministrationMember, AdministrationMemberAdminDetailsDto>();

            CreateMap<AdministrationMemberCreateDto, AdministrationMember>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore());

            CreateMap<AdministrationMemberUpdateDto, AdministrationMember>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore());

            CreateMap<Document, DocumentListItemDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom((src, dest, _, context) =>
                    GetLocalizedValue(src.NameUa, src.NameEn, context)))
                .ForMember(dest => dest.Description, opt => opt.MapFrom((src, dest, _, context) =>
                    GetLocalizedValue(src.DescriptionUa, src.DescriptionEn, context)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom((src, dest, _, context) =>
                    GetLocalizedValue(src.Category.NameUa, src.Category.NameEn, context)));

            CreateMap<Document, DocumentDetailsDto>()
                .IncludeBase<Document, DocumentListItemDto>();

            CreateMap<DocumentCreateDto, Document>()
            .ForMember(dest => dest.FilePath, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatorId, opt => opt.Ignore());

            CreateMap<DocumentUpdateDto, Document>()
                .ForMember(dest => dest.FilePath, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.EditorId, opt => opt.Ignore());

            CreateMap<Document, DocumentAdminDetailsDto>()
                .ForMember(dest => dest.CategoryNameUa, opt => opt.MapFrom(src => src.Category.NameUa))
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator.UserName))
                .ForMember(dest => dest.EditorName, opt => opt.MapFrom(src => src.Editor.UserName));
            CreateMap<Document, DocumentAdminDto>()
                .ForMember(dest => dest.CategoryNameUa, opt => opt.MapFrom(src => src.Category.NameUa))
                .ForMember(dest => dest.CategoryNameEn, opt => opt.MapFrom(src => src.Category.NameEn));


            CreateMap<ExternalLink, ExternalLinkAdminListItemDto>();

            CreateMap<ExternalLink, ExternalLinkAdminDetailsDto>()
                .IncludeBase<ExternalLink, ExternalLinkAdminListItemDto>()
                .ForMember(d => d.CreatorName, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.UserName : "System"))
                .ForMember(d => d.EditorName, opt => opt.MapFrom(src => src.Editor != null ? src.Editor.UserName : null));

            CreateMap<ExternalLinkCreateDto, ExternalLink>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<ExternalLinkUpdateDto, ExternalLink>()
                .ForMember(dest => dest.PhotoPath, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<ExternalLink, ExternalLinkDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom((src, _, _, context) =>
                    GetLocalizedValue(src.NameUa, src.NameEn, context)))
                .ForMember(dest => dest.ShortDescription, opt => opt.MapFrom((src, _, _, context) =>
                    GetLocalizedValue(src.ShortDescriptionUa, src.ShortDescriptionEn, context)));

            CreateMap<Tag, TagDto>()
                .ForMember(d => d.Name, opt => opt.MapFrom((src, dest, destMember, context) =>
                    context.Items["lang"]?.ToString() == "en" ? src.NameEn : src.NameUa));

            CreateMap<TagCreateUpdateDto, Tag>();

            CreateMap<DocumentCategory, CategoryDto>()
            .ForMember(d => d.Name, opt => opt.MapFrom((src, dest, destMember, context) =>
                context.Items.ContainsKey("lang") && context.Items["lang"]?.ToString() == "en"
                    ? src.NameEn
                    : src.NameUa));

            CreateMap<CategoryCreateUpdateDto, DocumentCategory>();

            CreateMap<DocumentCategory, CategoryAdminDto>()
            .ForMember(d => d.DocumentsCount, opt => opt.MapFrom(src => src.Documents.Count));

            CreateMap<Tag, AdminTagDto>()
                .ForMember(d => d.NewsCount, opt => opt.MapFrom(src => src.News.Count));
        }

        private static string GetLanguage(ResolutionContext context)
        {
            if (context.Items.TryGetValue("lang", out var langObj) &&
                langObj is string lang &&
                lang.Equals("en", StringComparison.OrdinalIgnoreCase))
            {
                return "en";
            }

            return "ua";
        }

        private static string GetLocalizedValue(string? ua, string? en, ResolutionContext context)
        {
            var lang = GetLanguage(context);

            return lang == "en"
                ? (en ?? ua ?? string.Empty)
                : (ua ?? en ?? string.Empty);
        }

        private static string BuildShortInfo(string? text, int maxLength = 180)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            var cleanText = Regex.Replace(text, "<.*?>", string.Empty);
            cleanText = Regex.Replace(cleanText, @"\s+", " ").Trim();

            if (cleanText.Length <= maxLength)
                return cleanText;

            return cleanText.Substring(0, maxLength).TrimEnd() + "...";
        }
    }
}
