using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MindVault.Core.Entities;
using MindVault.Infrastructure.Identity;

namespace MindVault.Infrastructure.Data.Mappings;

public class NoteMapping : IEntityTypeConfiguration<Note>
{
    public void Configure(EntityTypeBuilder<Note> builder)
    {
        builder.ToTable("Notes");
        
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.Title)
            .HasMaxLength(200);
        
        builder.Property(x => x.Content)
            .HasColumnType("nvarchar(max)");

        builder.HasOne<ApplicationUser>()
            .WithMany(x => x.Notes)
            .HasForeignKey(x => x.UserId);
        
        builder.HasMany(x => x.Categories)
            .WithMany(x => x.Notes)
            .UsingEntity<Dictionary<string, string>>(
                "NoteCategories",
                j => j.HasOne<Category>()
                    .WithMany()
                    .HasForeignKey("CategoryId")
                    .OnDelete(DeleteBehavior.Restrict),
                j => j.HasOne<Note>()
                    .WithMany()
                    .HasForeignKey("NoteId")
                    .OnDelete(DeleteBehavior.Restrict));
    }
}