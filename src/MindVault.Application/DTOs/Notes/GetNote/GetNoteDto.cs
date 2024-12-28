using MindVault.Application.DTOs.Categories.GetCategory;

namespace MindVault.Application.DTOs.Notes.GetNote;

public class GetNoteDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string UserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<GetCategoryDto> Categories { get; set; } = [];
}