using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindVault.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_Note_Base64Iv : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Notes",
                newName: "CipherContent");

            migrationBuilder.AddColumn<string>(
                name: "Base64IV",
                table: "Notes",
                type: "nvarchar(150)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Base64IV",
                table: "Notes");

            migrationBuilder.RenameColumn(
                name: "CipherContent",
                table: "Notes",
                newName: "Content");
        }
    }
}
