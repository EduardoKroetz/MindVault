using MindVault.Application.DTOs.Users.GetUserDto;
using MindVault.Core.Common.Results;

namespace MindVault.Application.Services.Interfaces;

public interface IAccountService
{
    Task<Result<string>> RegisterAsync(string username, string email, string password);
    Task<Result<string>> LoginAsync(string email, string password);
    Task<Result<GetUserDto?>> GetUserAsync(string email);
}