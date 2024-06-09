using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionColorSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PromotionSize",
                table: "Promotions",
                newName: "PromotionSizeName");

            migrationBuilder.RenameColumn(
                name: "PromotionColor",
                table: "Promotions",
                newName: "PromotionColorName");

            migrationBuilder.RenameColumn(
                name: "PromotionSize",
                table: "PromotionResults",
                newName: "PromotionSizeName");

            migrationBuilder.RenameColumn(
                name: "PromotionColor",
                table: "PromotionResults",
                newName: "PromotionColorName");

            migrationBuilder.AddColumn<int>(
                name: "PromotionColorId",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PromotionSizeId",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PromotionColorId",
                table: "PromotionResults",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PromotionSizeId",
                table: "PromotionResults",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PromotionColorId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionSizeId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionColorId",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "PromotionSizeId",
                table: "PromotionResults");

            migrationBuilder.RenameColumn(
                name: "PromotionSizeName",
                table: "Promotions",
                newName: "PromotionSize");

            migrationBuilder.RenameColumn(
                name: "PromotionColorName",
                table: "Promotions",
                newName: "PromotionColor");

            migrationBuilder.RenameColumn(
                name: "PromotionSizeName",
                table: "PromotionResults",
                newName: "PromotionSize");

            migrationBuilder.RenameColumn(
                name: "PromotionColorName",
                table: "PromotionResults",
                newName: "PromotionColor");
        }
    }
}
