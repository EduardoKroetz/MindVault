using MindVault.Core.Common.Interfaces;
using MindVault.Core.Entities;

namespace MindVault.Core.Repositories;

public interface ICategoryRepository : IBaseRepository<Category>
{
    Task<IEnumerable<Category>> GetAsync(int pageNumber, int pageSize, string userId);
}