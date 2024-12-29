using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Application.Services.Interfaces;
using MindVault.Core.Entities;

namespace MindVault.Application.Common.AutoMapper;

public class ContentDecryptResolver : IValueResolver<Note, GetNoteDto, string>
{
    private readonly IEncryptionService _encryptionService;

    public ContentDecryptResolver(IEncryptionService encryptionService)
    {
        _encryptionService = encryptionService;
    }

    public string Resolve(Note source, GetNoteDto destination, string destMember, ResolutionContext context)
    {
        return _encryptionService.Decrypt(source.CipherContent, source.Base64IV);
    }
}