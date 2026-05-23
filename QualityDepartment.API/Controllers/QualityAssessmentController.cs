using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/quality-assessment")]
    public class QualityAssessmentController : ControllerBase
    {
        private readonly DocumentService _documentService;

        public QualityAssessmentController(DocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet("internal")]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DocumentListItemDto>>>> GetInternal([FromQuery] DocumentParams docParams)
        {
            var result = await _documentService.GetDocumentsByCategoryNameAsync("Внутрішнє оцінювання якості", docParams);
            return Ok(ApiResponse<PagedResultDto<DocumentListItemDto>>.SuccessResponse(result));
        }

        [HttpGet("external")]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DocumentListItemDto>>>> GetExternal([FromQuery] DocumentParams docParams)
        {
            var result = await _documentService.GetDocumentsByCategoryNameAsync("Зовнішнє оцінювання якості", docParams);
            return Ok(ApiResponse<PagedResultDto<DocumentListItemDto>>.SuccessResponse(result));
        }
    }
}