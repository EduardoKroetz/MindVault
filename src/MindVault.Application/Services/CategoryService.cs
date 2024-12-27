using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Core.Services;

namespace MindVault.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<int> CreateCategoryAsync(string name, string description, string color, string userId)
    {
        var category = new Category
        {
            Name = name,
            Description = description,
            Color = color,
            UserId = userId
        };
        
        await _categoryRepository.AddAsync(category);
        
        return category.Id;
    }
}