namespace MindVault.Application.Extensions;

public static class DateTimeOffSetExtensions
{
    public static DateTime ToBrazilianDateTime(this DateTimeOffset dateTime)
    {
        var brazilianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        return TimeZoneInfo.ConvertTime(dateTime, brazilianTimeZone).DateTime;
    }
}