using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.DTOs.Categories.EditorCategory;
using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Core.Common.Results;
using MindVault.Core.Services;
using MindVault.Web.Extensions;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IMapper _mapper;
    
    public CategoriesController(ICategoryService categoryService, IMapper mapper)
    {
        _categoryService = categoryService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategoryAsync(EditorCategoryDto dto)
    {
        var userId = User.GetUserId();
        
        var categoryId = await _categoryService.CreateCategoryAsync(dto.Name, dto.Description, dto.Color , userId);
        
        return CreatedAtAction("GetCategoryById", new { categoryId }, Result.Success(new { Id = categoryId }, 201));
    }
    
    [HttpGet("{categoryId:int}", Name = "GetCategoryById")]
    public async Task<IActionResult> GetCategoryByIdAsync(int categoryId)
    {
        var userId = User.GetUserId();
        
        var result = await _categoryService.GetCategoryAsync(categoryId, userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);

        var dto = _mapper.Map<GetCategoryDto>(result.Data);
        
        return Ok(Result<GetCategoryDto>.Success(dto));
    }
    
    [HttpPut("{categoryId:int}")]
    public async Task<IActionResult> UpdateCategoryAsync(EditorCategoryDto dto,int categoryId)
    {
        var userId = User.GetUserId();
        
        var result = await _categoryService.UpdateCategoryAsync(dto.Name, dto.Description, dto.Color, categoryId, userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);
        
        return NoContent();
    }
    
    [HttpDelete("{categoryId:int}")]
    public async Task<IActionResult> DeleteCategoryAsync(int categoryId)
    {
        var userId = User.GetUserId();
        
        var result = await _categoryService.DeleteCategoryAsync(categoryId , userId);
        if (result.Succeeded is false)
            return StatusCode(result.Status, result);
        
        return NoContent();
    }
}