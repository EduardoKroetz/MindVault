using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Application.Extensions;
using MindVault.Core.Entities;

namespace MindVault.Application.Common.AutoMapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<Note, GetNoteDto>()
            .ForMember(dest => dest.Content, op => op.MapFrom(x => x.CipherContent))
            .ForMember(dest => dest.UpdatedAt, op => op.MapFrom(x => x.UpdatedAt.ToBrazilianDateTime()))
            .ForMember(dest => dest.CreatedAt, op => op.MapFrom(x => x.CreatedAt.ToBrazilianDateTime()));
        CreateMap<Category, GetCategoryDto>();
    }
}