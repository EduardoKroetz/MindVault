namespace MindVault.Application.DTOs.Users.CreateUser;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Informe o nome de usuário")
            .NotNull().WithMessage("Informe o nome de usuário")
            .MaximumLength(100).WithMessage("O nome de usuário deve possuir no máximo 100 caracteres");
        
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Informe o e-mail")
            .NotNull().WithMessage("Informe o e-mail")
            .EmailAddress().WithMessage("Informe o e-mail em um formato válido");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Informe a senha")
            .NotNull().WithMessage("Informe a senha")
            .MinimumLength(6).WithMessage("A senha deve possuir no mínimo 6 caracteres")
            .MaximumLength(32).WithMessage("A senha deve possuir no máximo 32 caracteres");
    }
}