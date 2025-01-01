namespace MindVault.Application.DTOs.Notes.SearchNote;

public class SearchNoteDto
{
    public string? Reference { get; set; } = null;
    public int? CategoryId { get; set; } = null;
    public DateTime? Date { get; set; } = null;
    public int PageSize { get; set; } = 15;
    public int PageNumber { get; set; } = 1;
}