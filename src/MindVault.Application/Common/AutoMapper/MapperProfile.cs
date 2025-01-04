using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Core.Entities;
using MindVault.Extensions.Application;

namespace MindVault.Application.Common.AutoMapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<Note, GetNoteDto>()
            .ForMember(dest => dest.Content, op => op.MapFrom(x => x.CipherContent))
            .ForMember(dest => dest.CreatedAt, op => op.MapFrom(x => x.CreatedAt.ToBrazilianTime()))
            .ForMember(dest => dest.UpdatedAt, op => op.MapFrom(x => x.UpdatedAt.ToBrazilianTime()));
        CreateMap<Category, GetCategoryDto>();
    }
}