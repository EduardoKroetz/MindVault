using Microsoft.AspNetCore.Authorization;
using MindVault.Application.Common.Interfaces;
using MindVault.Application.Common.Models;
using MindVault.Application.DTOs.Auth.CreateUser;

namespace MindVault.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAuthorizationService _authorizationService;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;

    public IdentityService(UserManager<ApplicationUser> userManager, IAuthorizationService authorizationService, IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory)
    {
        _userManager = userManager;
        _authorizationService = authorizationService;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(CreateUserDto createUserDto)
    {
        if (await EmailAlreadyExistAsync(createUserDto.Email))
            return (Result.Failure(["O e-mail já está cadastrado"]),string.Empty);
        
        if (await UsernameAlreadyExistAsync(createUserDto.UserName))
            return (Result.Failure(["O nome de usuário já está cadastrado"]),string.Empty);

        var user = new ApplicationUser
        {
            UserName = createUserDto.UserName,
            Email = createUserDto.Email
        };
        
        var result = await _userManager.CreateAsync(user, createUserDto.Password);

        return (result.ToApplicationResult(), user.Id);
    }
    
    public async Task<bool> EmailAlreadyExistAsync(string email)
        => await _userManager.FindByEmailAsync(email) is not null;

    public async Task<bool> UsernameAlreadyExistAsync(string username)
        => await _userManager.FindByNameAsync(username) is not null;

}   