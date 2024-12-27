namespace MindVault.Application.DTOs.Auth.Login;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Informe o e-mail")
            .NotNull().WithMessage("Informe o e-mail")
            .EmailAddress().WithMessage("Informe o e-mail em um formato válido");
        
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Informe a senha")
            .NotNull().WithMessage("Informe a senha")
            .MinimumLength(6).WithMessage("A senha deve possuir no mínimo 6 caracteres");
    }
}