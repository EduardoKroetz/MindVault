using Microsoft.AspNetCore.Mvc;
using MindVault.Application.Common.Interfaces;
using MindVault.Application.DTOs.Auth.Login;
using MindVault.Application.DTOs.Users.CreateUser;
using MindVault.Core.Common.Results;
using MindVault.Application.Services.Interfaces;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;
    private readonly IAuthService _authService;

    public AuthController(IIdentityService identityService, ITokenService tokenService, IAuthService authService)
    {
        _identityService = identityService;
        _tokenService = tokenService;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(CreateUserDto dto)
    {
        var result = await _authService.RegisterAsync(dto.UserName, dto.Email, dto.Password);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return Ok(Result<object>.Success(new { Token = result.Data }));
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto.Email, dto.Password);
        if (result.Succeeded is false)
            return BadRequest(result);
        
        return Ok(Result<object>.Success(new { Token = result.Data }));
    }
}