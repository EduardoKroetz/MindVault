namespace MindVault.Extensions.Application;

public static class DateTimeExtensions
{
    public static DateTime ToBrazilianTime(this DateTime dateTime)
    {
        var brazilianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
        return TimeZoneInfo.ConvertTime(dateTime, brazilianTimeZone);
    }
}