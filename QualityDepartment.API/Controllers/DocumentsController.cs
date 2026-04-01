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

            return Ok(new ApiResponse<PagedResultDto<DocumentListItemDto>>
            {
                Success = true,
                Data = result
            });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<DocumentDetailsDto>>> GetById(int id, [FromQuery] string lang = "ua")
        {
            var result = await _documentService.GetDocumentByIdAsync(id, lang);

            if (result == null)
            {
                return NotFound(ApiResponse<object>.FailureResponse(
                    new List<string> { "Document with ID {id} does not exist." }, 
                    "Документ не знайдено"
                ));
            }

            return Ok(new ApiResponse<DocumentDetailsDto>
            {
                Success = true,
                Data = result
            });
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var fileResult = await _documentService.DownloadDocumentAsync(id);

            if (fileResult == null)
            {
                return NotFound(ApiResponse<object>.FailureResponse(
                    new List<string> { $"File with ID {id} not found." },
                    "Файл не знайдено"
                ));
            }

            return File(fileResult.Value.stream, fileResult.Value.contentType, fileResult.Value.fileName);
        }

        [HttpGet("{id}/preview")]
        public async Task<IActionResult> Preview(int id)
        {
            var fileResult = await _documentService.GetDocumentPreviewAsync(id);

            if (fileResult == null)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    new List<string> { $"File with ID {id} not available for the preview or not found." },
                    "Попередній перегляд недоступний для цього формату або файл не знайдено."
                ));
            }

            Response.Headers.Add("Content-Disposition", "inline; filename=\"" + fileResult.Value.fileName + "\"");
            return File(fileResult.Value.stream, fileResult.Value.contentType);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<LookupDto>>>> GetCategories([FromQuery] string lang = "ua")
        {
            var categories = await _documentService.GetCategoriesLookupAsync(lang);
            return Ok(new ApiResponse<List<LookupDto>> { Success = true, Data = categories });
        }

    }
}