using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.DTOs.Categories.EditorCategory;
using MindVault.Core.Common.Results;
using MindVault.Core.Services;
using MindVault.Web.Extensions;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost, Authorize]
    public async Task<IActionResult> CreateCategoryAsync(EditorCategoryDto dto)
    {
        var userId = User.GetUserId();
        
        var categoryId = await _categoryService.CreateCategoryAsync(dto.Name, dto.Description, dto.Color , userId);
        
        return Ok(Result.Success(new  { Id = categoryId }));
    }
}