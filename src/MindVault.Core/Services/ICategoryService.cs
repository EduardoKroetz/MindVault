namespace MindVault.Core.Services;

public interface ICategoryService
{
    Task<int> CreateCategoryAsync(string name, string description, string color, string userId);
}