using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Application.DTOs.Notes.EditorNote;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Application.DTOs.Notes.SearchNote;
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

    public async Task<int> CreateNoteAsync(string userId, EditorNoteDto dto)
    {
        var iv = _encryptionService.GenerateRandomIv();
        var cipherContent = _encryptionService.Encrypt(dto.Content, iv);
        var base64Iv = Convert.ToBase64String(iv);
        
        var categories = await GetCategoriesByListId(dto.Categories);
        
        var note = new Note
        {
            Title = dto.Title,
            CipherContent = cipherContent,
            UserId = userId,
            Base64IV = base64Iv,
            Categories = categories
        };

        await _noteRepository.AddAsync(note);

        return note.Id;
    }
    
    public async Task<Result> UpdateNoteAsync(EditorNoteDto dto, int noteId, string userId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note is null)
            return Result.Failure(["Anotação não encontrada"]); 

        if (HasUserPermissionToAccessNote(note, userId) is false)
            return Result.Failure(["Você não tem permissão para atualizar essa Anotação"], 403);

        // Encrypt content
        var iv = Convert.FromBase64String(note.Base64IV);
        var cipherContent = _encryptionService.Encrypt(dto.Content, iv);
        
        note.Title = dto.Title;
        note.CipherContent = cipherContent;
        note.Categories = await GetCategoriesByListId(dto.Categories);
        
        await _noteRepository.UpdateAsync(note);    
        
        return Result.Success(noteId);
    }

    private async Task<List<Category>> GetCategoriesByListId(int[] ids)
    {
        List<Category> categories = [];
        foreach (var categoryId in ids)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category != null)
                categories.Add(category);
        }

        return categories;
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
            CreatedAt = x.CreatedAt,
            UpdatedAt = x.UpdatedAt,
        });
        
        var result = PaginatedResult<GetNoteDto>.Create(resultDto, data.Count, dto.PageNumber, dto.PageSize);
        
        return result;
    }
    
    public async Task<PaginatedResult<DateTime>> GetNotesDatesAsync(string userId, int pageSize, int pageNumber)
    {
        var data = await _noteRepository.GetNoteDates(userId, pageSize, pageNumber);
        
        var result = PaginatedResult<DateTime>.Create(data.Dates, data.TotalCount, pageNumber, pageSize);
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