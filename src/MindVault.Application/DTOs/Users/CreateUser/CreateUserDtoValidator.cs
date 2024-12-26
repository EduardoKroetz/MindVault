using MindVault.Application.Common.Interfaces;

namespace MindVault.Application.DTOs.Auth.CreateUser;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    private readonly IIdentityService _identityService;
    
    public CreateUserDtoValidator(IIdentityService identityService)
    {
        _identityService = identityService;

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Informe o nome de usuário")
            .MaximumLength(100).WithMessage("O nome de usuário deve possuir no máximo 100 caracteres");
        
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Informe o e-mail")
            .EmailAddress().WithMessage("Informe o e-mail em um formato válido");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Informe a senha")
            .MinimumLength(6).WithMessage("A senha deve possuir no mínimo 6 caracteres")
            .MaximumLength(32).WithMessage("A senha deve possuir no máximo 32 caracteres");
    }
}