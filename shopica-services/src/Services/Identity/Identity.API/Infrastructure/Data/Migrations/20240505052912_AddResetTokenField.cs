using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddResetTokenField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TokenResetPassword",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TokenResetPassword",
                table: "Users");
        }
    }
}
