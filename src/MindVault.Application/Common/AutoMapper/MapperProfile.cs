using MindVault.Application.DTOs.Categories.GetCategory;
using MindVault.Application.DTOs.Notes.GetNote;
using MindVault.Core.Entities;

namespace MindVault.Application.Common.AutoMapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<Note, GetNoteDto>()
            .ForMember(dest => dest.Content, opt => opt.MapFrom<ContentDecryptResolver>());
        CreateMap<Category, GetCategoryDto>();
    }
}