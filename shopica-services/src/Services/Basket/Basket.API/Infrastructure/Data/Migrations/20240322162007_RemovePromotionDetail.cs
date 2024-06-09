using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovePromotionDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionDetails");

            migrationBuilder.RenameColumn(
                name: "PromotionDetailId",
                table: "PromotionResults",
                newName: "SalesByQuantity");

            migrationBuilder.AddColumn<decimal>(
                name: "PromotionAmount",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "PromotionById",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PromotionByName",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PromotionDiscount",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PromotionDiscountLimit",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "PromotionQuantity",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SalesByAmount",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "SalesById",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SalesByName",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SalesByQuantity",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SalesByAmount",
                table: "PromotionResults",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "SalesById",
                table: "PromotionResults",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SalesByName",
                table: "PromotionResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PromotionAmount",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionById",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionByName",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionDiscount",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionDiscountLimit",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PromotionQuantity",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesByAmount",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesById",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesByName",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesByQuantity",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "SalesByAmount",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "SalesById",
                table: "PromotionResults");

            migrationBuilder.DropColumn(
                name: "SalesByName",
                table: "PromotionResults");

            migrationBuilder.RenameColumn(
                name: "SalesByQuantity",
                table: "PromotionResults",
                newName: "PromotionDetailId");

            migrationBuilder.CreateTable(
                name: "PromotionDetails",
                columns: table => new
                {
                    PromotionCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PromotionById = table.Column<int>(type: "int", nullable: false),
                    PromotionByName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionDiscount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PromotionDiscountLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PromotionQuantity = table.Column<int>(type: "int", nullable: false),
                    SalesByAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SalesById = table.Column<int>(type: "int", nullable: false),
                    SalesByName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SalesByQuantity = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionDetails", x => new { x.PromotionCode, x.Id });
                    table.ForeignKey(
                        name: "FK_PromotionDetails_Promotions_PromotionCode",
                        column: x => x.PromotionCode,
                        principalTable: "Promotions",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
