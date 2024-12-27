using MindVault.Application.Common.Interfaces;
using MindVault.Application.DTOs.Auth.Login;
using MindVault.Application.DTOs.Users.CreateUser;
using MindVault.Application.DTOs.Users.GetUserDto;
using MindVault.Core.Common.Results;

namespace MindVault.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(string username, string email, string password)
    {
        if (await EmailAlreadyExistAsync(email))
            return (Result.Failure(["O e-mail já está cadastrado"]),string.Empty);
        
        if (await UsernameAlreadyExistAsync(username))
            return (Result.Failure(["O nome de usuário já está cadastrado"]),string.Empty);

        var user = new ApplicationUser
        {
            UserName = username,
            Email = email
        };
        
        var result = await _userManager.CreateAsync(user, password);

        return (result.ToApplicationResult(), user.Id);
    }
    
    private async Task<bool> EmailAlreadyExistAsync(string email)
        => await _userManager.FindByEmailAsync(email) is not null;

    private async Task<bool> UsernameAlreadyExistAsync(string username)
        => await _userManager.FindByNameAsync(username) is not null;

    public async Task<bool> ValidateCredentials(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return false;
        
        var result = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result == PasswordVerificationResult.Failed)
            return false;

        return true;
    }

    public async Task<Result<GetUserDto>> GetUserByEmail(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return Result<GetUserDto>.Failure(["Usuário não encontrado"]);

        var dto = new GetUserDto { Email = user.Email, UserId = user.Id, Username = user.UserName };
        return Result<GetUserDto>.Success(dto);
    }
}   