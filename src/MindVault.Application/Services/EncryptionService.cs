using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using MindVault.Application.Services.Interfaces;

namespace MindVault.Application.Services;

public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration configuration)
    {
        var key = configuration["Encryption:Key"] ?? throw new NullReferenceException("'Encryption:Key' cannot be null");
        _key = Encoding.UTF8.GetBytes(key);
    }

    public string Encrypt(string plainText, byte[] iv)
    {
        try
        {
            using var aes = Aes.Create();
        
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = _key;
            aes.IV = iv;
        
            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] encrypted = encryptor.TransformFinalBlock(plainTextBytes, 0, plainTextBytes.Length);
        
            return Convert.ToBase64String(encrypted);
        }
        catch
        {
            throw new InvalidOperationException("A criptografia dos dados falhou");
        }

    }

    public string Decrypt(string cipherText, string ivBase64)
    {
        try
        {
            byte[] iv = Convert.FromBase64String(ivBase64);

            using var aes = Aes.Create();
        
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = _key;
            aes.IV = iv;
        
            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            byte[] cipherTextBytes = Convert.FromBase64String(cipherText);
            byte[] plainTextBytes = decryptor.TransformFinalBlock(cipherTextBytes, 0, cipherTextBytes.Length);
        
            return Encoding.UTF8.GetString(plainTextBytes);
        }
        catch
        {
            throw new InvalidOperationException("A descriptografia dos dados falhou");
        }
    }

    public byte[] GenerateRandomIv()
    {
        using var rng = RandomNumberGenerator.Create();
        
        byte[] iv = new byte[16];
        rng.GetBytes(iv);
        return iv;
    }
}