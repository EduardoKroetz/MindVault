using Microsoft.AspNetCore.Mvc;
using MindVault.Application.Common.Interfaces;
using MindVault.Application.DTOs.Users.CreateUser;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public AuthController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync(CreateUserDto dto)
    {
        var result = await _identityService.CreateUserAsync(dto);
        if (result.Result.Succeeded is false)
            return BadRequest(result.Result);
        
        return NoContent();
    }
}