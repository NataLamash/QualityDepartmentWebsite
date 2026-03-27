using QualityDepartment.Core.DTOs.Home;
using QualityDepartment.Core.DTOs.News;
using QualityDepartment.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;
using AutoMapper;

namespace QualityDepartment.Core.Mappings;

     public class NewsAndHomeMappingProfile : Profile
{
    public NewsAndHomeMappingProfile()
    {
        CreateMap<New, NewsListItemDto>()
            .ForMember(
                dest => dest.Title,
                opt => opt.MapFrom((src, dest, destMember, context) =>
                    GetLocalizedValue(src.TitleUa, src.TitleEn, context)))
            .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate))
            .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.PhotoPath));

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
                opt => opt.MapFrom((src, dest, destMember, context) => GetLanguage(context)));

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