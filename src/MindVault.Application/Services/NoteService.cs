using System.Collections;
using System.Text;
using AutoMapper;
using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Application.DTOs.Notes.SearchNote;
using MindVault.Application.Extensions;
using MindVault.Core.Common.Results;
using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Application.Services.Interfaces;

namespace MindVault.Application.Services;

public class NoteService : INoteService
{
    private readonly INoteRepository _noteRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IEncryptionService _encryptionService;
    private readonly IMapper _mapper;
    private readonly string[] _blockedWords = new string[]
    {
        "de", "do", "da", "e", "o", "a", "em", "no", "na", "por", "com"
    };
    
    public NoteService(INoteRepository noteRepository, ICategoryRepository categoryRepository, IEncryptionService encryptionService, IMapper mapper)
    {
        _noteRepository = noteRepository;
        _categoryRepository = categoryRepository;
        _encryptionService = encryptionService;
        _mapper = mapper;
    }

    public async Task<int> CreateNoteAsync(string title, string content, string userId)
    {
        var iv = _encryptionService.GenerateRandomIv();
        var cipherContent = _encryptionService.Encrypt(content, iv);
        var base64Iv = Convert.ToBase64String(iv);
        
        var note = new Note
        {
            Title = title,
            CipherContent = cipherContent,
            UserId = userId,
            Base64IV = base64Iv,
        };

        await _noteRepository.AddAsync(note);    
        
        return note.Id;
    }
    
    public async Task<Result> UpdateNoteAsync(string title, string content, int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Anotação não encontrada"]); 

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result.Failure(["Você não tem permissão para atualizar essa Anotação"], 403);

        // Encrypt content
        var iv = Convert.FromBase64String(note.Base64IV);
        var cipherContent = _encryptionService.Encrypt(content, iv);
        
        note.Title = title;
        note.CipherContent = cipherContent;
        
        await _noteRepository.UpdateAsync(note);    
        
        return Result.Success(noteId);
    }
    
    public async Task<Result> DeleteNoteAsync(int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Anotação não encontrada"]);

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result.Failure(["Você não tem permissão para deletar essa Anotação"], 403);

        await _noteRepository.DeleteAsync(note);    
        
        return Result.Success(noteId);
    }
    
    public async Task<Result<GetNoteDto?>> GetNoteAsync(int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result<GetNoteDto?>.Failure(["Anotação não encontrada"]);

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result<GetNoteDto?>.Failure(["Você não tem permissão para acessar essa Anotação"], 403);
        
        note.CipherContent = _encryptionService.Decrypt(note.CipherContent, note.Base64IV);
        
        var noteDto = _mapper.Map<GetNoteDto>(note);
        
        return Result<GetNoteDto?>.Success(noteDto);
    }

    public async Task<PaginatedResult<GetNoteDto>> GetNotesAsync(string userId, SearchNoteDto dto)
    {
        var references = dto.Reference is null 
            ? null 
            : dto.Reference.ToLower().Split(' ').Where(x => x.Length > 1 && !_blockedWords.Contains(x)).ToArray();
        
        var data = await _noteRepository.GetNotesAsync(userId, dto.PageSize, dto.PageNumber, references, dto.Date, dto.CategoryId);
        
        var resultDto = data.Notes.Select(x => new GetNoteDto
        {
            Id = x.Id,
            Title = x.Title,
            Content = _encryptionService.Decrypt(x.CipherContent, x.Base64IV),
            UserId = x.UserId,
            Categories = _mapper.Map<ICollection<GetCategoryDto>>(x.Categories),
            CreatedAt = x.CreatedAt.ToBrazilianDateTime(),
            UpdatedAt = x.UpdatedAt.ToBrazilianDateTime(),
        });
        
        var result = PaginatedResult<GetNoteDto>.Create(resultDto, data.Count, dto.PageNumber, dto.PageSize);
        
        return result;
    }
    
    public async Task<PaginatedResult<DateTimeOffset>> GetNotesDatesAsync(string userId, int pageSize, int pageNumber)
    {
        var data = await _noteRepository.GetNoteDates(userId, pageSize, pageNumber);
        
        var result = PaginatedResult<DateTimeOffset>.Create(data.Dates, data.TotalCount, pageNumber, pageSize);
        return result;
    }
    
    public async Task<Result> AddNoteCategoryAsync(string userId, int noteId, int categoryId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Anotação não encontrada"]);

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result.Failure(["Você não tem permissão para acessar esse recurso"]);

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            return Result.Failure(["Categoria não encontrada"]);
        
        note.Categories.Add(category);
        
        await _noteRepository.UpdateAsync(note);
        
        return Result.Success();
    }
    
    public async Task<Result> RemoveNoteCategoryAsync(string userId, int noteId, int categoryId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Anotação não encontrada"]);

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result.Failure(["Você não tem permissão para acessar esse recurso"]);

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            return Result.Failure(["Categoria não encontrada"]);
        
        if (note.Categories.Remove(category) is false)
            return Result.Failure(["Não foi possível remover a categoria"]);
        
        await _noteRepository.UpdateAsync(note);
        
        return Result.Success();
    }

    private bool HasUserPermissionToAccessNote(Note note, string userId)
        => note.UserId == userId;
}