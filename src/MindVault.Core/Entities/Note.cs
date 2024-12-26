using MindVault.Core.Common;

namespace MindVault.Core.Entities;

public class Note : BaseEntity
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string UserId { get; set; }

    public ICollection<Category> Categories { get; set; } = [];
}