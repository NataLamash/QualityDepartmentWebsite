using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure.Services
{
    public class FileService
    {
        private readonly string _webRootPath;
        private const string BaseFolderName = "uploads";

        public FileService(IWebHostEnvironment env)
        {
            _webRootPath = env.WebRootPath;

            var uploadsPath = Path.Combine(_webRootPath, BaseFolderName);
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);
        }

        public bool IsFileValid(IFormFile file, string[] allowedExtensions, string[] allowedMimeTypes)
        {
            var ext = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(ext)) return false;

            if (!allowedMimeTypes.Contains(file.ContentType.ToLower())) return false;

            return true;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string subFolder)
        {
            var targetDirectory = Path.Combine(_webRootPath, BaseFolderName, subFolder);

            if (!Directory.Exists(targetDirectory))
                Directory.CreateDirectory(targetDirectory);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(targetDirectory, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{BaseFolderName}/{subFolder}/{fileName}";
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrEmpty(relativePath)) return;
            var fullPath = Path.Combine(_webRootPath, relativePath.TrimStart('/'));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}
