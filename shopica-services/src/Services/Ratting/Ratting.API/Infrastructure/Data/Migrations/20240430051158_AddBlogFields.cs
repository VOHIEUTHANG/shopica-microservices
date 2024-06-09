using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ratting.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Tag",
                table: "Blog",
                newName: "Tags");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Comment",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Comment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Comment",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "Comment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "Blog",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BackgroundUrl",
                table: "Blog",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "Blog");

            migrationBuilder.DropColumn(
                name: "BackgroundUrl",
                table: "Blog");

            migrationBuilder.RenameColumn(
                name: "Tags",
                table: "Blog",
                newName: "Tag");
        }
    }
}
