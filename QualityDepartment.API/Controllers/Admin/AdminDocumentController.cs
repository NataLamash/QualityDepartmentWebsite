using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Admin.Documents;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Infrastructure.Services;
using System.Security.Claims;

namespace QualityDepartment.API.Controllers.Admin
{
    //[Authorize(Policy = "AdminOnly")]
    [ApiController]
    [Route("api/admin/documents")]
    public class AdminDocumentController : ControllerBase
    {
        private readonly DocumentService _docService;
        public AdminDocumentController(DocumentService docService) 
            => _docService = docService;

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<DocumentAdminDetailsDto>>> GetById(int id)
        {
            var result = await _docService.GetAdminByIdAsync(id);

            if (result == null)
                return NotFound(ApiResponse<DocumentAdminDetailsDto>.FailureResponse(new List<string> { "DOCUMENT_NOT_FOUND" }));

            return Ok(ApiResponse<DocumentAdminDetailsDto>.SuccessResponse(result));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DocumentAdminDto>>>> GetAll(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] string? search = null
        )
        {
            var result = await _docService.GetAdminDocumentsAsync(page, pageSize, search);
            return Ok(ApiResponse<PagedResultDto<DocumentAdminDto>>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<DocumentAdminDto>>> Create([FromForm] DocumentCreateDto dto)
        {
            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userId = 1;
            var (result, errorCode) = await _docService.CreateAsync(dto, userId);

            if (errorCode != null) return BadRequest(ApiResponse<DocumentAdminDto>.FailureResponse(new List<string> { errorCode }));
            return Ok(ApiResponse<DocumentAdminDto>.SuccessResponse(result!, "DOCUMENT_CREATED"));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<DocumentAdminDto>>> Update(int id, [FromForm] DocumentUpdateDto dto)
        {
            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userId = 1;
            var (result, success, errorCode) = await _docService.UpdateAsync(id, dto, userId);

            if (errorCode != null) return BadRequest(ApiResponse<DocumentAdminDto>.FailureResponse(new List<string> { errorCode }));
            if (!success) return NotFound();

            return Ok(ApiResponse<DocumentAdminDto>.SuccessResponse(result!, "DOCUMENT_UPDATED"));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
        {
            var success = await _docService.DeleteAsync(id);
            return success ? Ok(ApiResponse<string>.SuccessResponse("DOCUMENT_DELETED")) : NotFound();
        }
    }
}
