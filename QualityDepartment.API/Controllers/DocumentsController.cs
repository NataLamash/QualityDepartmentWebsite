using Microsoft.AspNetCore.Mvc;
using QualityDepartment.Core.DTOs.Common;
using QualityDepartment.Core.DTOs.Documents;
using QualityDepartment.Infrastructure.Services;

namespace QualityDepartment.API.Controllers
{
    [ApiController]
    [Route("api/documents")]
    public class DocumentsController : ControllerBase
    {
        private readonly DocumentService _documentService;

        public DocumentsController(DocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DocumentListItemDto>>>> GetDocuments([FromQuery] DocumentParams docParams)
        {
            var result = await _documentService.GetDocumentsAsync(docParams);
            return Ok(ApiResponse<PagedResultDto<DocumentListItemDto>>.SuccessResponse(result));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<DocumentDetailsDto>>> GetById(int id, [FromQuery] string lang = "ua")
        {
            var result = await _documentService.GetDocumentByIdAsync(id, lang);

            if (result == null)
                return NotFound(ApiResponse<DocumentDetailsDto>.FailureResponse(new List<string> { "DOCUMENT_NOT_FOUND" }));

            return Ok(ApiResponse<DocumentDetailsDto>.SuccessResponse(result));
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var fileResult = await _documentService.DownloadDocumentAsync(id);

            if (fileResult == null)
                return NotFound(ApiResponse<object>.FailureResponse(new List<string> { "FILE_NOT_FOUND" }));

            return File(fileResult.Value.stream, fileResult.Value.contentType, fileResult.Value.fileName);
        }

        [HttpGet("{id}/preview")]
        public async Task<IActionResult> Preview(int id)
        {
            var fileResult = await _documentService.GetDocumentPreviewAsync(id);

            if (fileResult == null)
                return BadRequest(ApiResponse<object>.FailureResponse(new List<string> { "PREVIEW_UNAVAILABLE_OR_NOT_FOUND" }));

            Response.Headers.Append("Content-Disposition", "inline; filename=\"" + fileResult.Value.fileName + "\"");
            return File(fileResult.Value.stream, fileResult.Value.contentType);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<LookupDto>>>> GetCategories([FromQuery] string lang = "ua")
        {
            var categories = await _documentService.GetCategoriesLookupAsync(lang);
            return Ok(ApiResponse<List<LookupDto>>.SuccessResponse(categories));
        }
    }
}