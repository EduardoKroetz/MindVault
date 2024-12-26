namespace MindVault.Core.Services;

public interface ITokenService
{
    string GenerateToken(string userId, string username, string email);
}