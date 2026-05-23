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
    public class CategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CategoryService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<CategoryDto>> GetAllAsync(string lang = "ua")
        {
            var categories = await _context.DocumentCategories
            .AsNoTracking()
            .ToListAsync();

            return _mapper.Map<List<CategoryDto>>(categories, opt => opt.Items["lang"] = lang);
        }

        public async Task<(CategoryAdminDto? result, string? errorCode)> GetByIdAsync(int id)
        {
            var tag = await _context.DocumentCategories.FindAsync(id);
            if (tag == null) return (null, "CATEGORY_NOT_FOUND");

            return (_mapper.Map<CategoryAdminDto>(tag), null);
        }

        public async Task<List<CategoryAdminDto>> GetAllAdminAsync()
        {
            var categories = await _context.DocumentCategories
                .Include(c => c.Documents)
                .AsNoTracking()
                .Where(c => c.NameUa != "Внутрішнє оцінювання якості" && c.NameUa != "Зовнішнє оцінювання якості")
                .ToListAsync();

            return _mapper.Map<List<CategoryAdminDto>>(categories);
        }

        public async Task<(CategoryAdminDto? Result, string? ErrorCode)> CreateAsync(CategoryCreateUpdateDto dto)
        {
            if (await _context.DocumentCategories.AnyAsync(c => c.NameUa == dto.NameUa))
                return (null, "CATEGORY_ALREADY_EXISTS");

            var category = _mapper.Map<DocumentCategory>(dto);

            _context.DocumentCategories.Add(category);
            await _context.SaveChangesAsync();

            return (_mapper.Map<CategoryAdminDto>(category), null);
        }

        public async Task<(bool success, string? errorCode)> UpdateAsync(int id, CategoryCreateUpdateDto dto)
        {
            var category = await _context.DocumentCategories.FindAsync(id);
            if (category == null) return (false, "CATEGORY_NOT_FOUND");

            if (category.NameUa == "Внутрішнє оцінювання якості" || category.NameUa == "Зовнішнє оцінювання якості")
                return (false, "SYSTEM_CATEGORY_CANNOT_BE_MODIFIED");

            if (await _context.DocumentCategories.AnyAsync(c => c.NameUa == dto.NameUa && c.Id != id))
                return (false, "CATEGORY_ALREADY_EXISTS");

            _mapper.Map(dto, category);
            await _context.SaveChangesAsync();
            return (true, null);
        }


        public async Task<(bool success, string? errorCode)> DeleteAsync(int id)
        {
            var category = await _context.DocumentCategories
                .Include(c => c.Documents)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null) return (false, "CATEGORY_NOT_FOUND");

            if (category.Documents.Any())
                return (false, "CATEGORY_HAS_DOCUMENTS");

            _context.DocumentCategories.Remove(category);
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}
