using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Basket.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "promotiondetailseq",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "promotionresultseq",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                name: "PromotionResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    PromotionCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionDetailId = table.Column<int>(type: "int", nullable: false),
                    PromotionType = table.Column<int>(type: "int", nullable: false),
                    PromotionById = table.Column<int>(type: "int", nullable: false),
                    PromotionByName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionQuantity = table.Column<int>(type: "int", nullable: false),
                    PromotionAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PromotionDiscount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionResults", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Promotions",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promotions", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "PromotionDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    SalesById = table.Column<int>(type: "int", nullable: false),
                    SalesByName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SalesByQuantity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionById = table.Column<int>(type: "int", nullable: false),
                    PromotionByName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PromotionQuantity = table.Column<int>(type: "int", nullable: false),
                    PromotionAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PromotionDiscount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    PromotionCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionDetails_Promotions_PromotionCode",
                        column: x => x.PromotionCode,
                        principalTable: "Promotions",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionDetails_PromotionCode",
                table: "PromotionDetails",
                column: "PromotionCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionDetails");

            migrationBuilder.DropTable(
                name: "PromotionResults");

            migrationBuilder.DropTable(
                name: "Promotions");

            migrationBuilder.DropSequence(
                name: "promotiondetailseq");

            migrationBuilder.DropSequence(
                name: "promotionresultseq");
        }
    }
}
