using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public string Username { get; set; } = null!;
        public List<string> Roles { get; set; } = new();
    }
}
