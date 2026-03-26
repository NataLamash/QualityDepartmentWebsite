using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QualityDepartment.Core.Entities;
using QualityDepartment.Core.Mappings;
using QualityDepartment.Infrastructure.Data;
using AutoMapper;
using QualityDepartment.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySQL(connectionString!));

builder.Services.AddAutoMapper(cfg => { }, typeof(NewsAndHomeMappingProfile));
builder.Services.AddScoped<NewsService>();
builder.Services.AddScoped<HomeService>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole<int>>(options => {
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();