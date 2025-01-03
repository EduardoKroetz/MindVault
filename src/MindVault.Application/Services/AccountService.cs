using MindVault.Application.Common.Interfaces;
using MindVault.Application.DTOs.Users.GetUserDto;
using MindVault.Core.Common.Results;
using MindVault.Application.Services.Interfaces;

namespace MindVault.Application.Services;

public class AccountService : IAccountService
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;

    public AccountService(IIdentityService identityService, ITokenService tokenService)
    {
        _identityService = identityService;
        _tokenService = tokenService;
    }

    public async Task<Result<string>> RegisterAsync(string username, string email, string password)
    {
        var res = await _identityService.CreateUserAsync(username, email, password);
        if (res.Result.Succeeded is false)
            return Result<string>.Failure(res.Result.Errors);
        
        var token = _tokenService.GenerateToken(res.UserId, username, email);
        
        return Result<string>.Success(token);
    }

    public async Task<Result<string>> LoginAsync(string email, string password)
    {
        var isValid = await _identityService.ValidateCredentials(email, password);
        if (isValid is false)
            return Result<string>.Failure(["E-mail ou senha inválidos"]);
        
        var result = await _identityService.GetUserByEmail(email);
        if (result.Succeeded is false)
            return Result<string>.Failure(["Não foi possível obter os dados do usuário"]);

        var userData = result.Data;
        var token = _tokenService.GenerateToken(userData.UserId, userData.Username, userData.Email);
        return Result<string>.Success(token);
    }

    public async Task<Result<GetUserDto?>> GetUserAsync(string email)
    {
        var result = await _identityService.GetUserByEmail(email);
        if (result.Succeeded is false)
            return Result<GetUserDto?>.Failure(result.Errors);
        
        return Result<GetUserDto?>.Success(result.Data);      
    }
}