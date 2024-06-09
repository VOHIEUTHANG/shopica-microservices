using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionDetailField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PromotionDiscountLimit",
                table: "PromotionResults",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PromotionDiscountLimit",
                table: "PromotionDetails",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PromotionDiscountLimit",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "PromotionDiscountLimit",
                table: "PromotionDetails");
        }
    }
}
