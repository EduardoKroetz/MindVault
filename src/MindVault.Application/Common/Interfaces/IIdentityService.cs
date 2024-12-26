using MindVault.Application.DTOs.Users.CreateUser;
using MindVault.Application.Common.Models;

namespace MindVault.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<(Result Result, string UserId)> CreateUserAsync(CreateUserDto dto);
    Task<bool> EmailAlreadyExistAsync(string email);
    Task<bool> UsernameAlreadyExistAsync(string username);
}