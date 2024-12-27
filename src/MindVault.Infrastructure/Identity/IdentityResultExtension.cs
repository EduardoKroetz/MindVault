using MindVault.Core.Common.Results;

namespace MindVault.Infrastructure.Identity;

public static class IdentityResultExtension
{
    public static Result ToApplicationResult(this IdentityResult result)
    => result.Succeeded ?
        Result.Success(new {}) : 
        Result.Failure(result.Errors.Select(e => e.Description));
}