using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ratting.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addCustomerUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Comment",
                newName: "CustomerName");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Comment",
                newName: "CustomerId");

            migrationBuilder.AddColumn<string>(
                name: "CustomerImageUrl",
                table: "Comment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerImageUrl",
                table: "Comment");

            migrationBuilder.RenameColumn(
                name: "CustomerName",
                table: "Comment",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Comment",
                newName: "UserId");
        }
    }
}
