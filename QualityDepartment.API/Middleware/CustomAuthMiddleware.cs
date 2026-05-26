using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using QualityDepartment.Core.DTOs.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QualityDepartment.API.Middleware
{
    public class CustomAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            if (context.Response.StatusCode != 401 && context.Response.StatusCode != 403 || context.Response.HasStarted)
            {
                return;
            }
            context.Response.ContentType = "application/json";

            string errorCode = context.Response.StatusCode == 401 ? "UNAUTHORIZED" : "FORBIDDEN";
            var response = ApiResponse<object>.FailureResponse(new List<string> { errorCode });

            var jsonSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var json = JsonConvert.SerializeObject(response, jsonSettings);

            await context.Response.WriteAsync(json);
        }
    }
}