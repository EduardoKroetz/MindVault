using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using MindVault.Core.Common.Results;

namespace MindVault.Web.Middlewares;

public class ExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var result = Result.Failure(["Erro interno do servidor"], 500);
        
        await httpContext.Response.WriteAsJsonAsync(result, cancellationToken);

        return true;
    }
}