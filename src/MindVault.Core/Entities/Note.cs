using MindVault.Core.Common;

namespace MindVault.Core.Entities;

public class Note : BaseEntity
{
    public string Title { get; set; }
    public string CipherContent { get; set; }
    public string UserId { get; set; }
    public string Base64IV { get; set; }

    public ICollection<Category> Categories { get; set; } = [];
}