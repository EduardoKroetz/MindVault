using MindVault.Core.Common.Results;
using MindVault.Core.Entities;

namespace MindVault.Core.Services;

public interface INoteService
{
    Task<int> CreateNoteAsync(string title, string content, string userId);
    Task<Result> UpdateNoteAsync(string title, string content, int noteId, string userId);
    Task<Result> DeleteNoteAsync(int noteId, string userId);
    Task<Result<Note?>> GetNoteAsync(int noteId, string userId);
}