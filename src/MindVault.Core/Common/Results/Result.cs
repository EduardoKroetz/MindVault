namespace MindVault.Core.Common.Results;

public class Result<T>
{
    internal Result(bool succeeded, T data, IEnumerable<string> errors, int status) 
    {
        Succeeded = succeeded;
        Data = data;
        Errors = errors.ToArray();
        Status = status;
    }

    public T? Data { get; set; }
    public bool Succeeded { get; set; }
    public int Status { get; set; }
    public string[] Errors { get; set; }
    
    public static Result<T?> Success(T data, int status = 200) => new(true, data,Array.Empty<string>(), status);
    public static Result<T?> Failure(IEnumerable<string> errors, int status = 400) => new(false, default!, errors, status);
}

public class Result
{
    internal Result(bool succeeded, object data, IEnumerable<string> errors, int status) 
    {
        Succeeded = succeeded;
        Data = data;
        Errors = errors.ToArray();
        Status = status;
    }

    public object Data { get; set; }
    public bool Succeeded { get; set; }
    public int Status { get; set; }
    public string[] Errors { get; set; }
    
    public static Result Success(object data, int status = 200) => new(true, data,Array.Empty<string>(), status);
    public static Result Failure(IEnumerable<string> errors, int status = 400) => new(false, default!, errors, status);
}