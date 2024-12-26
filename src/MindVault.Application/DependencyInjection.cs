using System.Reflection;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Hosting;

namespace MindVault.Extensions.Application;

public static class DependencyInjection
{
    public static void AddApplicationServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        builder.Services.AddFluentValidationAutoValidation(x =>
            x.DisableDataAnnotationsValidation = true);
    }
}