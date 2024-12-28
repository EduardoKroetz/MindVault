using Microsoft.EntityFrameworkCore;
using MindVault.Core.Common;
using MindVault.Core.Common.Interfaces;
using MindVault.Infrastructure.Data;

namespace MindVault.Infrastructure.Common.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
{
    protected readonly MindVaultDbContext _context;

    public BaseRepository(MindVaultDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
    }
    
    public async Task UpdateAsync(T entity)
    {
        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteAsync(T entity)
    {
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
    }
    
    public async Task<T?> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAsync(int pageNumber, int pageSize)
    {
        var skip = (pageNumber - 1) * pageSize;
        
        return await _context.Set<T>()
            .Take(skip..pageNumber)
            .ToListAsync();
    }
}