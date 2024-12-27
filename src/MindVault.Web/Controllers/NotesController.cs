using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Core.Common.Results;
using MindVault.Core.Services;
using MindVault.Extensions.Application.DTOs.Notes.CreateNote;
using MindVault.Web.Extensions;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;

    public NotesController(INoteService noteService)
    {
        _noteService = noteService;
    }

    [HttpPost, Authorize]
    public async Task<IActionResult> CreateNoteAsync(CreateNoteDto dto)
    {
        var userId = User.GetUserId();

        var noteId = await _noteService.CreateNoteAsync(dto.Title, dto.Content, userId);
        
        return Ok(Result.Success(new { Id = noteId }));
    }
    
    [HttpDelete("{noteId:int}"), Authorize]
    public async Task<IActionResult> DeleteNoteAsync(int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.DeleteNoteAsync(noteId, userId);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return NoContent();
    }
}