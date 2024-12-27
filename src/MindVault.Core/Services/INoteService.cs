namespace MindVault.Core.Services;

public interface INoteService
{
    Task<int> CreateNoteAsync(string title, string content, string userId);
}