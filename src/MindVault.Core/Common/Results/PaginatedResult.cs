namespace MindVault.Core.Common.Results;

public class PaginatedResult<T>
{
    public IEnumerable<T> Data { get; set; }
    public int PageNumber { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }

    public PaginatedResult(IEnumerable<T> data, int count, int pageNumber, int pageSize)
    {
        Data = data;
        PageNumber = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
    }

    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    public static PaginatedResult<T> Create(IEnumerable<T> data, int count, int pageNumber, int pageSize)
        => new PaginatedResult<T>(data, count, pageNumber, pageSize);
}