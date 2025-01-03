using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.DTOs.Notes.EditorNote;
using MindVault.Application.DTOs.Notes.SearchNote;
using MindVault.Core.Common.Results;
using MindVault.Application.Services.Interfaces;
using MindVault.Web.Extensions;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;
    private readonly IMapper _mapper;

    public NotesController(INoteService noteService, IMapper mapper)
    {
        _noteService = noteService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateNoteAsync(EditorNoteDto dto)
    {
        var userId = User.GetUserId();

        var noteId = await _noteService.CreateNoteAsync(userId, dto);
        
        return Ok(Result.Success(new { Id = noteId }));
    }
    
    [HttpPut("{noteId:int}")]
    public async Task<IActionResult> UpdateNoteAsync(EditorNoteDto dto, int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.UpdateNoteAsync(dto, noteId, userId);
        if (result.Succeeded is false)
            return this.HandleFailure(result);
        
        return NoContent();
    }
    
    [HttpDelete("{noteId:int}")]
    public async Task<IActionResult> DeleteNoteAsync(int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.DeleteNoteAsync(noteId, userId);
        if (result.Succeeded is false)
            return this.HandleFailure(result);
        
        return NoContent();
    }
    
    [HttpGet("{noteId:int}")]
    public async Task<IActionResult> GetNoteAsync(int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.GetNoteAsync(noteId, userId);
        if (result.Succeeded is false)
            return this.HandleFailure(result);
        
        return Ok(result);
    }
    
    [HttpGet("search"), Authorize]
    public async Task<IActionResult> GetNotesAsync([FromQuery] SearchNoteDto searchNoteDto)
    {
        var userId = User.GetUserId();

        var result = await _noteService.GetNotesAsync(userId, searchNoteDto);
        
        return Ok(result);
    }
    
    [HttpPost("{noteId:int}/categories/{categoryId:int}"), Authorize]
    public async Task<IActionResult> AddNoteCategoryAsync([FromRoute] int noteId, [FromRoute] int categoryId)
    {
        var userId = User.GetUserId();
        
        var result = await _noteService.AddNoteCategoryAsync(userId ,noteId, categoryId);
        
        if (result.Succeeded is false)
            return this.HandleFailure(result);
        
        return NoContent();
    }
    
    [HttpDelete("{noteId:int}/categories/{categoryId:int}"), Authorize]
    public async Task<IActionResult> RemoveNoteCategoryAsync([FromRoute] int noteId, [FromRoute] int categoryId)
    {
        var userId = User.GetUserId();
        
        var result = await _noteService.RemoveNoteCategoryAsync(userId ,noteId, categoryId);
        
        if (result.Succeeded is false)
            return this.HandleFailure(result);
        
        return NoContent();
    }
    
    [HttpGet("dates"), Authorize]
    public async Task<IActionResult> GetNoteDatesAsync([FromQuery] int pageSize = 30, [FromQuery] int pageNumber = 1)
    {
        var userId = User.GetUserId();

        var result = await _noteService.GetNotesDatesAsync(userId, pageSize, pageNumber);
        
        return Ok(result);
    }
    
    
}