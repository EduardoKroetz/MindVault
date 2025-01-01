using MindVault.Core.Common.Interfaces;
using MindVault.Core.Entities;

namespace MindVault.Core.Repositories;

public interface INoteRepository : IBaseRepository<Note>
{
    Task<(IEnumerable<Note> Notes, int Count)> GetNotesAsync(string userId, int pageSize, int pageNumber,
        string[]? references, DateTime? updatedAt, int? categoryId);

    Task<(IEnumerable<DateTimeOffset> Dates, int TotalCount)> GetNoteDates(string userId, int pageSize, int pageNumber);
}