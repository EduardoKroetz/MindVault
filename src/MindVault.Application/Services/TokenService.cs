using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MindVault.Core.Services;

namespace MindVault.Application.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _jwtKey;
    private readonly string _audience;
    private readonly string _issuer;
    
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        _jwtKey = _configuration["Jwt:Key"] 
            ?? throw new ArgumentNullException("'Jwt:Key' is not configured");
        _audience = _configuration["Jwt:Audience"] 
            ?? throw new ArgumentNullException("'Jwt:Audience' is not configured");
        _issuer = _configuration["Jwt:Issuer"] 
            ?? throw new ArgumentNullException("'Jwt:Issuer' is not configured");
    }

    public string GenerateToken(string userId, string username, string email)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new (ClaimTypes.NameIdentifier, userId),
            new (ClaimTypes.Name, username),
            new (ClaimTypes.Email, email),
        };
        
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = _issuer,
            Audience = _audience,
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey)), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(descriptor);
        
        return tokenHandler.WriteToken(token);
    }
}