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

    public new async Task<Note?> GetByIdAsync(int id)
    {
        return await _context.Notes
            .Include(x => x.Categories)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(IEnumerable<Note> Notes, int Count)> GetNotesAsync(string userId, int pageSize, int pageNumber, string[]? references, DateTime? date, int? categoryId)
    {
        var query = _context.Notes
            .Where(note => note.UserId == userId)
            .Include(x => x.Categories)
            .OrderByDescending(x => x.CreatedAt)
            .AsQueryable();
        
        if (date is not null)
            query = query.Where(note => note.CreatedAt.Date == date.Value.Date);
        
        if (references is not null)
             query = FilterNotesByReferences(query, references);

        if (categoryId is not null)
        {
            query = query
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
            .ThenByDescending(x => x.Note.CreatedAt)
            .Select(x => x.Note);
    }

    public async Task<(IEnumerable<DateTime> Dates, int TotalCount)> GetNoteDates(string userId, int pageSize, int pageNumber)
    {
        var query = _context.Notes
            .Where(x => x.UserId == userId)
            .Select(x => x.CreatedAt)
            .AsQueryable();
            
        var count = await query.CountAsync();
            
        var dates = await query
            .OrderByDescending(x => x)
            .ToListAsync();

        var datesStr = dates
            .GroupBy(x =>  x.ToString("d"))
            .Select(x => DateTime.Parse(x.Key))
            .ToList();

        return (datesStr, count);
    }
}