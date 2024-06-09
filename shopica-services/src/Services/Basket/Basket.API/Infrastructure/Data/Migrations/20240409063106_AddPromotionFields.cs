using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PromotionColor",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionImageUrl",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionPrice",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionSize",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionColor",
                table: "PromotionResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionImageUrl",
                table: "PromotionResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionPrice",
                table: "PromotionResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PromotionSize",
                table: "PromotionResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PromotionColor",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionImageUrl",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionPrice",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionSize",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionColor",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "PromotionImageUrl",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "PromotionPrice",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "PromotionSize",
                table: "PromotionResults");
        }
    }
}
