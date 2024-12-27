using MindVault.Core.Common.Results;

namespace MindVault.Core.Services;

public interface INoteService
{
    Task<int> CreateNoteAsync(string title, string content, string userId);
    Task<Result> UpdateNoteAsync(string title, string content, int noteId, string userId);
    Task<Result> DeleteNoteAsync(int noteId, string userId);
}