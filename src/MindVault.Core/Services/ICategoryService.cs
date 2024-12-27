using MindVault.Core.Common.Results;
using MindVault.Core.Entities;

namespace MindVault.Core.Services;

public interface ICategoryService
{
    Task<int> CreateCategoryAsync(string name, string description, string color, string userId);
    Task<Result> DeleteCategoryAsync(int categoryId, string userId);
    Task<Result> UpdateCategoryAsync(string name, string description, string color, int categoryId, string userId);
    Task<Result<Category?>> GetCategoryAsync(int categoryId, string userId);
}