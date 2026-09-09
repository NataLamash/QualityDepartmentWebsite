using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using QualityDepartment.Core.Entities;
using QualityDepartment.Core.Mappings;
using QualityDepartment.Infrastructure.Data;
using QualityDepartment.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace QualityDepartment.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddMemoryCache();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySQL(connectionString!));

            services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy =>
                    policy.RequireRole("Admin", "SuperAdmin"));
                options.AddPolicy("SuperAdminOnly", policy =>
                    policy.RequireRole("SuperAdmin"));
            });

            services.AddScoped<NewsService>();
            services.AddScoped<HomeService>();
            services.AddScoped<DocumentService>();
            services.AddScoped<ExternalLinkService>();
            services.AddScoped<FileService>();
            services.AddScoped<AdministrationService>();
            services.AddScoped<CategoryService>();
            services.AddScoped<TagService>();
            services.AddScoped<SearchService>();
            services.AddScoped<EmailService>();
            services.AddScoped<AuthService>();
            services.AddScoped<ProfileService>();
            services.AddScoped<AdminUserService>();

            var jwtKey = configuration["Jwt:Key"];
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = ClaimTypes.Name
                };
            });

            services.AddAutoMapper(config =>
            {
                config.AddProfile<GeneralMappingProfile>();
            });

            return services;
        }

    }
}
