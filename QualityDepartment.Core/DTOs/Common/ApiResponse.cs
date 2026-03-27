using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public List<string>? Errors { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
            => new() { Success = true, Data = data, Message = message };

        public static ApiResponse<T> FailureResponse(List<string> errors, string? message = null)
            => new() { Success = false, Errors = errors, Message = message };
    }
}
