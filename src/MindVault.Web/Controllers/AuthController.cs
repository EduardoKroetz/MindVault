using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindVault.Application.Common.Interfaces;
using MindVault.Application.Common.Models;
using MindVault.Application.DTOs.Users.CreateUser;
using MindVault.Core.Services;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;

    public AuthController(IIdentityService identityService, ITokenService tokenService)
    {
        _identityService = identityService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(CreateUserDto dto)
    {
        var res = await _identityService.CreateUserAsync(dto);
        if (res.Result.Succeeded is false)
            return BadRequest(res.Result);
        
        var token = _tokenService.GenerateToken(res.UserId, dto.UserName, dto.Email);
        
        return Ok(ApiResult.Success(new { token }));
    }
}