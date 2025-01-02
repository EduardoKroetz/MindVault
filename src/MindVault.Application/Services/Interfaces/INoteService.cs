using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Application.DTOs.Notes.SearchNote;
using MindVault.Core.Common.Results;
using MindVault.Core.Entities;

namespace MindVault.Application.Services.Interfaces;

public interface INoteService
{
    Task<int> CreateNoteAsync(string title, string content, string userId);
    Task<Result> UpdateNoteAsync(string title, string content, int noteId, string userId);
    Task<Result> DeleteNoteAsync(int noteId, string userId);
    Task<Result<GetNoteDto?>> GetNoteAsync(int noteId, string userId);
    Task<PaginatedResult<GetNoteDto>> GetNotesAsync(string userId, SearchNoteDto dto);
    Task<Result> AddNoteCategoryAsync(string userId, int noteId, int categoryId);
    Task<Result> RemoveNoteCategoryAsync(string userId, int noteId, int categoryId);
    Task<PaginatedResult<DateTime>> GetNotesDatesAsync(string userId, int pageSize, int pageNumber);
}