using MindVault.Core.Common;

namespace MindVault.Core.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Color { get; set; }
    public string UserId { get; set; }

    public ICollection<Note> Notes { get; set; }
}