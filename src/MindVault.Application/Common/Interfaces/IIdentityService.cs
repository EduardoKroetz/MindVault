using MindVault.Application.DTOs.Users.GetUserDto;
using MindVault.Core.Common.Results;

namespace MindVault.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<(Result Result, string UserId)> CreateUserAsync(string username, string email, string password);
    Task<bool> ValidateCredentials(string email, string password);
    Task<Result<GetUserDto>> GetUserByEmail(string email);
}