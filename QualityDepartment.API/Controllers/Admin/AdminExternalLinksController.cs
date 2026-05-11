using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.ExternalLinks;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/external-links")]
    //[Authorize(Policy = "AdminOnly")]
    public class AdminExternalLinksController : ControllerBase
    {
        private readonly ExternalLinkService _linkService;
        public AdminExternalLinksController(ExternalLinkService linkService) => _linkService = linkService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ExternalLinkAdminListItemDto>>>> GetAll()
        {
            var links = await _linkService.GetAdminLinksAsync();
            return Ok(ApiResponse<List<ExternalLinkAdminListItemDto>>.SuccessResponse(links));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ExternalLinkAdminDetailsDto>>> GetById(int id)
        {
            var (result, errorCode) = await _linkService.GetAdminByIdAsync(id);

            if (result == null)
                return NotFound(ApiResponse<ExternalLinkAdminDetailsDto>.FailureResponse(new List<string> { errorCode! }));

            return Ok(ApiResponse<ExternalLinkAdminDetailsDto>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ExternalLinkAdminDetailsDto>>> Create([FromForm] ExternalLinkCreateDto dto)
        {
            //var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userId = 1;
            var (result, errorCode) = await _linkService.CreateAsync(dto, userId);

            if (result == null) return BadRequest(ApiResponse<ExternalLinkAdminDetailsDto>.FailureResponse(new List<string> { errorCode! }));
            return Ok(ApiResponse<ExternalLinkAdminDetailsDto>.SuccessResponse(result, "LINK_CREATED_SUCCESS"));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ExternalLinkAdminDetailsDto>>> Update(int id, [FromForm] ExternalLinkUpdateDto dto)
        {
            //var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userId = 1;
            var (result, success, errorCode) = await _linkService.UpdateAsync(id, dto, userId);

            if (!success) return BadRequest(ApiResponse<ExternalLinkAdminDetailsDto>.FailureResponse(new List<string> { errorCode! }));
            return Ok(ApiResponse<ExternalLinkAdminDetailsDto>.SuccessResponse(result!, "LINK_UPDATED_SUCCESS"));
        }

        [HttpPatch("{id}/reorder")]
        public async Task<ActionResult<ApiResponse<bool>>> Reorder(int id, [FromQuery] int targetPosition)
        {
            var (success, errorCode) = await _linkService.ReorderAsync(id, targetPosition);

            if (!success)
            {
                return BadRequest(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "REORDER_ERROR" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "REORDER_SUCCESS"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var (success, errorCode) = await _linkService.DeleteAsync(id);

            if (!success)
            {
                return NotFound(ApiResponse<bool>.FailureResponse(new List<string> { errorCode ?? "DELETE_ERROR" }));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "LINK_DELETED_SUCCESS"));
        }
    }
}
