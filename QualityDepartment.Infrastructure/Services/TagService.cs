using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.TagsAndCategories;
using QualityDepartment.Core.Entities;
using QualityDepartment.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure.Services
{
    public class TagService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TagService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TagDto>> GetTagsAsync(string lang = "ua")
        {
            return await _context.Tags
                .AsNoTracking()
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = lang == "en" ? t.NameEn : t.NameUa
                })
                .ToListAsync();
        }

        public async Task<TagDto> CreateAsync(TagCreateUpdateDto dto)
        {
            var tag = new Tag { NameUa = dto.NameUa, NameEn = dto.NameEn };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return new TagDto { Id = tag.Id, Name = tag.NameUa };
        }

        public async Task<bool> UpdateAsync(int id, TagCreateUpdateDto dto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return false;

            tag.NameUa = dto.NameUa;
            tag.NameEn = dto.NameEn;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return false;

            _context.Tags.Remove(tag);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
