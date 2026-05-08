using AutoMapper;
using QualityDepartment.Core.DTOs.Admin.Administration;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.Entities;
using QualityDepartment.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure.Services
{
    public class AdministrationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly FileService _fileService;
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
        private readonly string saveFolder = "administration";

        public AdministrationService(ApplicationDbContext context, IMapper mapper, FileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<List<AdministrationMemberAdminDto>> GetAdminMembersAsync()
        {
            var items = await _context.AdministrationMembers
                                   .OrderBy(x => x.SortOrder)
                                   .ToListAsync();

            return _mapper.Map<List<AdministrationMemberAdminDto>>(items);
        }

        public async Task<(AdministrationMemberAdminDto? result, string? errorCode)> CreateAsync(AdministrationMemberCreateDto dto, int userId)
        {
            if (dto.Photo != null && dto.Photo.Length > MaxFileSizeBytes)
                return (null, "FILE_TOO_LARGE");

            var member = _mapper.Map<AdministrationMember>(dto);

            var maxSort = await _context.AdministrationMembers.MaxAsync(x => (short?)x.SortOrder) ?? 0;
            member.SortOrder = (short)(maxSort + 1);

            member.CreatedAt = DateTime.UtcNow;
            member.CreatorId = userId;

            if (dto.Photo != null)
                member.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);

            _context.AdministrationMembers.Add(member);
            await _context.SaveChangesAsync();

            return (_mapper.Map<AdministrationMemberAdminDto>(member), null);
        }

        public async Task<(AdministrationMemberAdminDto? result, bool success, string? errorCode)> UpdateAsync(int id, AdministrationMemberUpdateDto dto, int userId)
        {
            if (dto.Photo != null && dto.Photo.Length > MaxFileSizeBytes)
                return (null, false, "FILE_TOO_LARGE");

            var member = await _context.AdministrationMembers.FindAsync(id);
            if (member == null) return (null, false, "MEMBER_NOT_FOUND");

            _mapper.Map(dto, member);
            member.UpdatedAt = DateTime.UtcNow;
            member.EditorId = userId;

            if (dto.Photo != null)
            {
                _fileService.DeleteFile(member.PhotoPath);
                member.PhotoPath = await _fileService.SaveFileAsync(dto.Photo, saveFolder);
            }
            else if (!dto.KeepOldPhoto)
            {
                _fileService.DeleteFile(member.PhotoPath);
                member.PhotoPath = null;
            }

            await _context.SaveChangesAsync();
            return (_mapper.Map<AdministrationMemberAdminDto>(member), true, null);
        }

        public async Task<bool> ReorderAsync(int id, int targetPosition)
        {
            var member = await _context.AdministrationMembers.FindAsync(id);
            if (member == null || targetPosition < 1) return false;

            var oldPosition = member.SortOrder;
            if (oldPosition == targetPosition) return true;

            var allMembers = await _context.AdministrationMembers
                .OrderBy(x => x.SortOrder)
                .ToListAsync();

            allMembers.Remove(member);

            if (targetPosition > allMembers.Count)
                allMembers.Add(member);
            else
                allMembers.Insert(targetPosition - 1, member);

            for (int i = 0; i < allMembers.Count; i++)
            {
                allMembers[i].SortOrder = (short)(i + 1);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var member = await _context.AdministrationMembers.FindAsync(id);
            if (member == null) return false;

            if (!string.IsNullOrEmpty(member.PhotoPath)) _fileService.DeleteFile(member.PhotoPath);

            _context.AdministrationMembers.Remove(member);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<AdministrationMemberAdminDetailsDto?> GetAdminByIdAsync(int id)
        {
            var member = await _context.AdministrationMembers.FindAsync(id);
            return _mapper.Map<AdministrationMemberAdminDetailsDto>(member);
        }
    }
}
