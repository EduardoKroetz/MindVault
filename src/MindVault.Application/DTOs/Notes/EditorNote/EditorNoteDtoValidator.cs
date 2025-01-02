using MindVault.Application.DTOs.Notes.EditorNote;

namespace MindVault.Application.DTOs.Notes.CreateNote;

public class EditorNoteDtoValidator : AbstractValidator<EditorNoteDto>
{
    public EditorNoteDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Informe o título")
            .NotNull().WithMessage("Informe o título")
            .MaximumLength(200).WithMessage("O título deve possuir no máximo 200 caracteres");
    }
}