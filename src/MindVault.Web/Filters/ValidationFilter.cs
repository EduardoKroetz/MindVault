using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MindVault.Web.Filters;

public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.Errors.FirstOrDefault().ErrorMessage);
            
            var result = new { Succeeded = false, Errors = errors };
            context.Result = new BadRequestObjectResult(result);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}