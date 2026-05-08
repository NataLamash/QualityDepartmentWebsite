using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.Common
{
    public class AllowedExtensionsAttribute: ValidationAttribute
    {
        private readonly string[] _extensions;

        public AllowedExtensionsAttribute(string[] extensions)
        {
            _extensions = extensions;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not IFormFile file) return ValidationResult.Success;

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!_extensions.Contains(extension))
            {
                return new ValidationResult("INVALID_FILE_EXTENSION");
            }

            return ValidationResult.Success;
        }
    }
}
