using MindVault.Core.Common.Results;

namespace MindVault.Core.Services;

public interface IAuthService
{
    Task<Result<string>> RegisterAsync(string username, string email, string password);
    Task<Result<string>> LoginAsync(string email, string password);
}