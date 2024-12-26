using MindVault.Application.Common.Models;

namespace MindVault.Infrastructure.Identity;

public static class IdentityResultExtension
{
    public static Result ToApplicationResult(this IdentityResult result)
    => result.Succeeded ?
        Result.Success() : 
        Result.Failure(result.Errors.Select(e => e.Description));
}