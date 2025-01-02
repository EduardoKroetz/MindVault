using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindVault.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class NoteCategories_DeleteActions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NoteCategories_Categories_CategoryId",
                table: "NoteCategories");

            migrationBuilder.AddForeignKey(
                name: "FK_NoteCategories_Categories_CategoryId",
                table: "NoteCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NoteCategories_Categories_CategoryId",
                table: "NoteCategories");

            migrationBuilder.AddForeignKey(
                name: "FK_NoteCategories_Categories_CategoryId",
                table: "NoteCategories",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
