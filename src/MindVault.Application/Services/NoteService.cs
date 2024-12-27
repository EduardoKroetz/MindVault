using AutoMapper;
using MindVault.Application.DTOs.Notes.GetNote;
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
    
    public async Task<Result> UpdateNoteAsync(string title, string content, int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Nota não encontrada"]);

        if (note.UserId != userId)
            return Result.Failure(["Você não tem permissão para atualizar essa Nota"], 403);

        note.Title = title;
        note.Content = content;
        
        await _noteRepository.UpdateAsync(note);    
        
        return Result.Success(noteId);
    }
    
    public async Task<Result> DeleteNoteAsync(int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Nota não encontrada"]);

        if (note.UserId != userId)
            return Result.Failure(["Você não tem permissão para deletar essa Nota"], 403);

        await _noteRepository.DeleteAsync(note);    
        
        return Result.Success(noteId);
    }
    
    public async Task<Result<Note?>> GetNoteAsync(int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result<Note?>.Failure(["Nota não encontrada"]);

        if (note.UserId != userId)
            return Result<Note?>.Failure(["Você não tem permissão para acessar essa Nota"], 403);
        
        return Result<Note?>.Success(note);
    }
}