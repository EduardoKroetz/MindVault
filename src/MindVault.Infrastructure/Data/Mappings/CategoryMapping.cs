using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MindVault.Core.Entities;
using MindVault.Infrastructure.Identity;

namespace MindVault.Infrastructure.Data.Mappings;

public class CategoryMapping : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.HasOne<ApplicationUser>()
            .WithMany(x => x.Categories)
            .HasForeignKey(x => x.UserId);

    }
}