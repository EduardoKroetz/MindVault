using System.Security.Claims;

namespace MindVault.Web.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal principal)
    {
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            throw new UnauthorizedAccessException("Não foi possível obter o id do usuário");

        return userId;
    }
}