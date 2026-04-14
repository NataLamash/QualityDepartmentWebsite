using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QualityDepartment.Core.Entities;
using QualityDepartment.Core.Mappings;
using QualityDepartment.Infrastructure.Data;
using QualityDepartment.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Text;

namespace QualityDepartment.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySQL(connectionString!));

            services.AddIdentity<ApplicationUser, IdentityRole<int>>(options => {
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
            });

            services.AddScoped<NewsService>();
            services.AddScoped<HomeService>();
            services.AddScoped<DocumentService>();
            services.AddScoped<ExternalLinkService>();


            services.AddAutoMapper(config =>
            {
                config.AddProfile<GeneralMappingProfile>();
            });

            return services;
        }
    }
}
