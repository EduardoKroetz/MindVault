using Microsoft.AspNetCore.Mvc;
using MindVault.Core.Common.Results;

namespace MindVault.Web.Extensions;

public static class ControllerBaseExtensions
{
    public static IActionResult HandleFailure(this ControllerBase controller, Result result)
    => controller.StatusCode(result.Status, result);
    
    public static IActionResult HandleFailure<T>(this ControllerBase controller, Result<T> result)
        => controller.StatusCode(result.Status, result);
}