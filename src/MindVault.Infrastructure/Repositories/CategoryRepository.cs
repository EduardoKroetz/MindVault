using Microsoft.EntityFrameworkCore;
using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Infrastructure.Common.Repositories;
using MindVault.Infrastructure.Data;

namespace MindVault.Infrastructure.Repositories;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(MindVaultDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetAsync(int pageNumber, int pageSize, string userId)
    {
        return await _context.Categories
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
}