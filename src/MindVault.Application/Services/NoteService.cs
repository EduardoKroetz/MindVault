using MindVault.Core.Common.Results;
using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Core.Services;

namespace MindVault.Application.Services;

public class NoteService : INoteService
{
    private readonly INoteRepository _noteRepository;

    public NoteService(INoteRepository noteRepository)
    {
        _noteRepository = noteRepository;
    }

    public async Task<int> CreateNoteAsync(string title, string content, string userId)
    {
        var note = new Note
        {
            Title = title,
            Content = content,
            UserId = userId
        };

        await _noteRepository.AddAsync(note);    
        
        return note.Id;
    }
}