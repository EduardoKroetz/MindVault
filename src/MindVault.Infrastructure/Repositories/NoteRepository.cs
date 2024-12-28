using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Infrastructure.Common.Repositories;
using MindVault.Infrastructure.Data;

namespace MindVault.Infrastructure.Repositories;

public class NoteRepository : BaseRepository<Note>, INoteRepository
{
    public NoteRepository(MindVaultDbContext context) : base(context)
    {
    }

    public async Task<(IEnumerable<Note> Notes, int Count)> GetNotesAsync(string userId, int pageSize, int pageNumber, string[]? references, DateTime? updatedAt, int? categoryId)
    {
        var query = _context.Notes
            .Where(note => note.UserId == userId)
            .OrderByDescending(x => x.UpdatedAt)
            .AsQueryable();
        
        if (updatedAt is not null)
            query = query.Where(note => note.UpdatedAt  >= updatedAt.Value);
        
        if (references is not null)
             query = FilterNotesByReferences(query, references);

        if (categoryId is not null)
        {
            query = query
                .Include(x => x.Categories)
                .Where(x => 
                    x.Categories.Any(category => category.Id == categoryId));
        }
        
        var totalCount = await query.CountAsync();
        
        var notes = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return (notes, totalCount);
    }

    private IQueryable<Note> FilterNotesByReferences(IQueryable<Note> query, string[] references)
    {
        return query
            .Select(note => new
            {
                Note = note,
                Score = references.Count(r => note.Title.ToLower().Contains(r.ToLower()))
            })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Note.UpdatedAt)
            .Select(x => x.Note);
    }
}