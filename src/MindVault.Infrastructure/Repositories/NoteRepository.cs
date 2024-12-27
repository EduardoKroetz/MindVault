using MindVault.Core.Entities;
using MindVault.Core.Repositories;
using MindVault.Infrastructure.Common.Repositories;
using MindVault.Infrastructure.Data;

namespace MindVault.Infrastructure.Repositories;

public class NoteRepository : BaseRepository<Note>, INoteRepository
{
    public NoteRepository(MindVaultDbContext context) : base(context)
    {
    }
}