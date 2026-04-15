using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure.Services
{
    public class FileService
    {
        private readonly string _contentRootPath;

        public FileService(IWebHostEnvironment env)
        {
            _contentRootPath = Path.Combine(env.WebRootPath, "uploads", "news");
            if (!Directory.Exists(_contentRootPath)) Directory.CreateDirectory(_contentRootPath);
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_contentRootPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/news/{fileName}";
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrEmpty(relativePath)) return;
            var fullPath = Path.Combine(_contentRootPath, Path.GetFileName(relativePath));
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}
