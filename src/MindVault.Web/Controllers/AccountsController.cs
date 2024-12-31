using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.DTOs.Auth.Login;
using MindVault.Application.DTOs.Users.CreateUser;
using MindVault.Application.Services.Interfaces;
using MindVault.Core.Common.Results;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(CreateUserDto dto)
    {
        var result = await _accountService.RegisterAsync(dto.UserName, dto.Email, dto.Password);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return Ok(Result<object>.Success(new { Token = result.Data }));
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LoginDto dto)
    {
        var result = await _accountService.LoginAsync(dto.Email, dto.Password);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return Ok(Result<object>.Success(new { Token = result.Data }));
    }    
    
    [HttpGet, Authorize]
    public async Task<IActionResult> GetAccountDetailsAsync()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return BadRequest(Result.Failure(["Não foi possível obter o e-mail do usuário"]));
        
        var result = await _accountService.GetUserAsync(email);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return Ok(result);
    }
}