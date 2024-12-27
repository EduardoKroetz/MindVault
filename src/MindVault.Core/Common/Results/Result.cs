namespace MindVault.Core.Common.Results;

public class Result<T>
{
    internal Result(bool succeeded, T data, IEnumerable<string> errors) 
    {
        Succeeded = succeeded;
        Data = data;
        Errors = errors.ToArray();
    }

    public T? Data { get; set; }
    public bool Succeeded { get; set; }
    public string[] Errors { get; set; }
    
    public static Result<T?> Success(T data) => new(true, data,Array.Empty<string>());
    public static Result<T?> Failure(IEnumerable<string> errors) => new(false, default!, errors);
}

public class Result
{
    internal Result(bool succeeded, object data, IEnumerable<string> errors) 
    {
        Succeeded = succeeded;
        Data = data;
        Errors = errors.ToArray();
    }

    public object Data { get; set; }
    public bool Succeeded { get; set; }
    public string[] Errors { get; set; }
    
    public static Result Success(object data) => new(true, data,Array.Empty<string>());
    public static Result Failure(IEnumerable<string> errors) => new(false, null ,errors);
}