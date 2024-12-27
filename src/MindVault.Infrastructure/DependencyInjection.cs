using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MindVault.Application.Common.Interfaces;
using MindVault.Core.Repositories;
using MindVault.Infrastructure.Data;
using MindVault.Infrastructure.Identity;
using MindVault.Infrastructure.Repositories;

namespace MindVault.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        //Config Db
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new NullReferenceException("Connection string 'DefaultConnection' not found");
        
        builder.Services.AddDbContext<MindVaultDbContext>(x =>
            x.UseSqlServer(connectionString));
        
        //Config Identity
        builder.Services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<MindVaultDbContext>();

        builder.Services.AddScoped<IIdentityService, IdentityService>();

        
        //Config Repositories
        builder.Services.AddScoped<INoteRepository, NoteRepository>();

    }
}