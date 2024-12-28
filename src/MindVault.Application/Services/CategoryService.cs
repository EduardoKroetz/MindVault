using MindVault.Core.Common.Results;
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
    
    public async Task<Result> DeleteCategoryAsync(int categoryId, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            return Result.Failure(["Categoria não encontrada"]);
        
        if (HasPermissionToAccessCategory(category, userId) is false)
            return Result.Failure(["Você não tem permissão para deletar essa categoria"]);

        await _categoryRepository.DeleteAsync(category);
        
        return Result.Success();
    }
    
    public async Task<Result> UpdateCategoryAsync(string name, string description, string color, int categoryId, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            return Result.Failure(["Categoria não encontrada"]);

        if (HasPermissionToAccessCategory(category, userId) is false)
            return Result.Failure(["Você não tem permissão para atualizar essa categoria"]);
        
        //Update category data
        category.Name = name;
        category.Description = description;
        category.Color = color;
        
        await _categoryRepository.UpdateAsync(category);
        
        return Result.Success();
    }

    public async Task<Result<Category?>> GetCategoryAsync(int categoryId, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            return Result<Category>.Failure(["Categoria não encontrada"]);

        if (HasPermissionToAccessCategory(category, userId) is false)
            return Result<Category>.Failure(["Você não tem permissão para acessar essa categoria"]);
        
        return Result<Category>.Success(category);
    }
    
    public async Task<Result<IEnumerable<Category>?>> GetCategoriesAsync(int pageNumber, int pageSize ,string userId)
    {
        var categories = await _categoryRepository.GetAsync(pageNumber, pageSize, userId);
        return Result<IEnumerable<Category>>.Success(categories);
    }
    
    private bool HasPermissionToAccessCategory(Category category, string userId)
        => category.UserId == userId;
    
}