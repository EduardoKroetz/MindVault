using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.DTOs.Notes.CreateNote;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Core.Common.Results;
using MindVault.Core.Services;
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

        var noteId = await _noteService.CreateNoteAsync(dto.Title, dto.Content, userId);
        
        return Ok(Result.Success(new { Id = noteId }));
    }
    
    [HttpPut("{noteId:int}")]
    public async Task<IActionResult> UpdateNoteAsync(EditorNoteDto dto, int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.UpdateNoteAsync(dto.Title, dto.Content, noteId, userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);
        
        return NoContent();
    }
    
    [HttpDelete("{noteId:int}")]
    public async Task<IActionResult> DeleteNoteAsync(int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.DeleteNoteAsync(noteId, userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);
        
        return NoContent();
    }
    
    [HttpGet("{noteId:int}")]
    public async Task<IActionResult> GetNoteAsync(int noteId)
    {
        var userId = User.GetUserId();

        var result = await _noteService.GetNoteAsync(noteId, userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);
        
        var dto = _mapper.Map<GetNoteDto>(result.Data);
        
        return Ok(Result<GetNoteDto>.Success(dto));
    }
}