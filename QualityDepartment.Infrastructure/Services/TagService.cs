using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.DTOs.Admin.News;
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
            var tags = await _context.Tags
                .AsNoTracking()
                .Where(t => t.NameUa != "Заходи")
                .ToListAsync();

            return _mapper.Map<List<TagDto>>(tags, opt => opt.Items["lang"] = lang);
        }

        public async Task<(AdminTagDto? result, string? errorCode)> GetByIdAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return (null, "TAG_NOT_FOUND");

            return (_mapper.Map<AdminTagDto>(tag), null);
        }
        public async Task<List<AdminTagDto>> GetAllAdminAsync()
        {
            var tags = await _context.Tags
                .AsNoTracking()
                .Where(t => t.NameUa != "Заходи")
                .ToListAsync();

            return _mapper.Map<List<AdminTagDto>>(tags);
        }

        public async Task<int?> GetTagIdByNameAsync(string nameUa)
        {
            var tag = await _context.Tags
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.NameUa == nameUa);
            return tag?.Id;
        }

        public async Task<(AdminTagDto? Result, string? ErrorCode)> CreateAsync(TagCreateUpdateDto dto)
        {
            if (await _context.Tags.AnyAsync(c => c.NameUa == dto.NameUa))
                return (null, "TAG_ALREADY_EXISTS");

            var tag = _mapper.Map<Tag>(dto);
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            return (_mapper.Map<AdminTagDto>(tag), null);
        }

        public async Task<(bool success, string? errorCode)> UpdateAsync(int id, TagCreateUpdateDto dto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return (false, "TAG_NOT_FOUND");

            if (tag.NameUa == "Заходи")
                return (false, "SYSTEM_TAG_CANNOT_BE_MODIFIED");

            if (await _context.Tags.AnyAsync(c => c.NameUa == dto.NameUa && c.Id != id))
                return (false, "TAG_ALREADY_EXISTS");

            _mapper.Map(dto, tag);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? errorCode)> DeleteAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return (false, "TAG_NOT_FOUND");

            if (tag.NameUa == "Заходи")
                return (false, "SYSTEM_TAG_CANNOT_BE_MODIFIED");

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}
