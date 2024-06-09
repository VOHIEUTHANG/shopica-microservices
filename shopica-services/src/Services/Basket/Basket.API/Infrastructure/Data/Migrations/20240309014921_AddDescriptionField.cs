using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PromotionDetails",
                table: "PromotionDetails");

            migrationBuilder.DropIndex(
                name: "IX_PromotionDetails_PromotionCode",
                table: "PromotionDetails");

            migrationBuilder.DropSequence(
                name: "promotiondetailseq");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "PromotionDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PromotionDetails",
                table: "PromotionDetails",
                columns: new[] { "PromotionCode", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PromotionDetails",
                table: "PromotionDetails");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "PromotionDetails");

            migrationBuilder.CreateSequence(
                name: "promotiondetailseq",
                incrementBy: 10);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PromotionDetails",
                table: "PromotionDetails",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionDetails_PromotionCode",
                table: "PromotionDetails",
                column: "PromotionCode");
        }
    }
}
