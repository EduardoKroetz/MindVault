namespace MindVault.Application.Common.Models;

public class ApiResult : Result
{
    internal ApiResult(bool succeeded, object data, IEnumerable<string> errors) : base(succeeded, errors)
    {
        Data = data;
    }

    public object Data { get; set; }

    public static ApiResult Success(object data) => new ApiResult(true, data, []);
}