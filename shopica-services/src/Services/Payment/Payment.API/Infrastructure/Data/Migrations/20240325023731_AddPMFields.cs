using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPMFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MethodName",
                table: "PaymentMethods",
                newName: "Name");

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "PaymentMethods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "PaymentMethods",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "PaymentMethods",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "PaymentMethods");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "PaymentMethods",
                newName: "MethodName");
        }
    }
}
