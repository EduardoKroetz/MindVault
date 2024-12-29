namespace MindVault.Application.Services.Interfaces;

public interface IEncryptionService
{
    string Encrypt(string plainText, byte[] iv);
    string Decrypt(string cipherText, string ivBase64);
    byte[] GenerateRandomIv();
}