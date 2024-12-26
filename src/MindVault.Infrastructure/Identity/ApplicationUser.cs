using Microsoft.AspNetCore.Identity;
using MindVault.Core.Entities;

namespace MindVault.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public ICollection<Note> Notes { get; set; } = [];
    public ICollection<Category> Categories { get; set; } = [];
}