namespace MindVault.Core.Common;

public class BaseEntity
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; private set; } = NewDate();
    public DateTime UpdatedAt { get; private set; } = NewDate();

    private static DateTime NewDate()
    {
        var brazilianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        return TimeZoneInfo.ConvertTime(DateTime.UtcNow, brazilianTimeZone);
    }
}