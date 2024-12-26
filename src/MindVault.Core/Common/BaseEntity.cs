namespace MindVault.Core.Common;

public class BaseEntity
{
    public int Id { get; set; }

    public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; private set; } = DateTimeOffset.UtcNow;

    public void UpdateTimestamp() => UpdatedAt = DateTimeOffset.UtcNow;
}