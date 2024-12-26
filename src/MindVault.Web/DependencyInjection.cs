using Microsoft.AspNetCore.Mvc;
using MindVault.Web.Filters;

namespace MindVault.Web;

public static class DependencyInjection
{
    public static void AddServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers(x =>
        {
            x.Filters.Add<ValidationFilter>();
        });

        builder.Services.Configure<ApiBehaviorOptions>(x =>
        {
            x.SuppressModelStateInvalidFilter = true;
        });
    }
}