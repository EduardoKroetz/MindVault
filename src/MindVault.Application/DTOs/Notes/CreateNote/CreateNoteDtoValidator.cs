namespace MindVault.Extensions.Application.DTOs.Notes.CreateNote;

public class CreateNoteDtoValidator : AbstractValidator<CreateNoteDto>
{
    public CreateNoteDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Informe o título")
            .NotNull().WithMessage("Informe o título")
            .MaximumLength(200).WithMessage("O título deve possuir no máximo 200 caracteres");
    }
}