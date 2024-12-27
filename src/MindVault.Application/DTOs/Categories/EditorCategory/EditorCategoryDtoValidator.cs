namespace MindVault.Application.DTOs.Categories.EditorCategory;

public class EditorCategoryDtoValidator : AbstractValidator<EditorCategoryDto>
{
    public EditorCategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Informe o nome da categoria")
            .NotNull().WithMessage("Informe o nome da categoria")
            .MaximumLength(100).WithMessage("O nome da categoria deve possuir no máximo 100 caracteres");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Informe a cor da categoria");
    }
}