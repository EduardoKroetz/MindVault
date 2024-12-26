using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MindVault.Core.Entities;

namespace MindVault.Infrastructure.Data;

public class MindVaultDbContext : IdentityDbContext
{
    public MindVaultDbContext(DbContextOptions<MindVaultDbContext> options) : base(options)
    {
    }
    
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}