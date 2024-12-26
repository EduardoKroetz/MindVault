using System.Reflection;
using System.Text;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MindVault.Application.Services;
using MindVault.Core.Services;

namespace MindVault.Extensions.Application;

public static class DependencyInjection
{
    public static void AddApplicationServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        builder.Services.AddFluentValidationAutoValidation(x =>
            x.DisableDataAnnotationsValidation = true);

        //Configure authentication
        var jwtKey = builder.Configuration["Jwt:Key"] 
                     ?? throw new NullReferenceException("'Jwt:Key' is not configured");
        var jwtAudience = builder.Configuration["Jwt:Audience"] 
                          ?? throw new NullReferenceException("'Jwt:Audience' is not configured");
        var jwtIssuer = builder.Configuration["Jwt:Issuer"] 
                          ?? throw new NullReferenceException("'Jwt:Issuer' is not configured");
        builder.Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.TokenValidationParameters = new()
            {
                ValidateAudience = true,
                ValidAudience = jwtAudience,
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                RequireExpirationTime = true
            };
        });
        
        //Add application services
        builder.Services.AddScoped<ITokenService, TokenService>();
    }
}