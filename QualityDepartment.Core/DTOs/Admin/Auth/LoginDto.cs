using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Core.DTOs.Admin.Auth
{
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
