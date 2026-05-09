using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Administration;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers.Admin
{
    //[Authorize(Policy = "AdminOnly")]
    [ApiController]
    [Route("api/admin/administration")]
    public class AdminAdministrationController : ControllerBase
    {
        private readonly AdministrationService _adminService;

        public AdminAdministrationController(AdministrationService adminService) => _adminService = adminService;

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<AdministrationMemberAdminDetailsDto>>> GetById(int id)
        {
            var result = await _adminService.GetAdminByIdAsync(id);
            if (result == null) return NotFound();

            return Ok(ApiResponse<AdministrationMemberAdminDetailsDto>.SuccessResponse(result));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AdministrationMemberAdminDto>>>> GetAll()
        {
            var result = await _adminService.GetAdminMembersAsync();
            return Ok(ApiResponse<List<AdministrationMemberAdminDto>>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AdministrationMemberAdminDto>>> Create([FromForm] AdministrationMemberCreateDto dto)
        {
            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userId = 1;
           var (result, errorCode) = await _adminService.CreateAsync(dto, userId);

            if (errorCode != null)
                return BadRequest(ApiResponse<AdministrationMemberAdminDto>.FailureResponse(new List<string> { errorCode }));

            return Ok(ApiResponse<AdministrationMemberAdminDto>.SuccessResponse(result!, "MEMBER_CREATED_SUCCESS"));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<AdministrationMemberAdminDto>>> Update(int id, [FromForm] AdministrationMemberUpdateDto dto)
        {
            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userId = 1;
           var (result, success, errorCode) = await _adminService.UpdateAsync(id, dto, userId);

            if (errorCode != null)
                return BadRequest(ApiResponse<AdministrationMemberAdminDto>.FailureResponse(new List<string> { errorCode }));

            if (!success) return NotFound();

            return Ok(ApiResponse<AdministrationMemberAdminDto>.SuccessResponse(result!, "MEMBER_UPDATED_SUCCESS"));
        }

        [HttpPatch("reorder")]
        public async Task<ActionResult<ApiResponse<string>>> Reorder([FromBody] AdministrationMemberReorderDto dto)
        {
            var success = await _adminService.ReorderAsync(dto.Id, dto.TargetPosition);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("ORDER_UPDATED"))
                : BadRequest(ApiResponse<string>.FailureResponse(new List<string> { "REORDER_FAILED" }));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
        {
            var success = await _adminService.DeleteAsync(id);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("MEMBER_DELETED_SUCCESSFULLY"))
                : NotFound(ApiResponse<string>.FailureResponse(new List<string> { "MEMBER_NOT_FOUND" }));
        }
    }
}
