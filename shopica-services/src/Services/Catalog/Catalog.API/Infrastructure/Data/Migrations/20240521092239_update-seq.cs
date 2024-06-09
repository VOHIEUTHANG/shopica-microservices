using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateseq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "sizeseq",
                oldIncrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "productseq",
                oldIncrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "colorseq",
                oldIncrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "categoryseq",
                oldIncrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "brandseq",
                oldIncrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "sizeseq",
                startValue: 200L);

            migrationBuilder.RestartSequence(
                name: "productseq",
                startValue: 200L);

            migrationBuilder.RestartSequence(
                name: "colorseq",
                startValue: 200L);

            migrationBuilder.RestartSequence(
                name: "categoryseq",
                startValue: 200L);

            migrationBuilder.RestartSequence(
                name: "brandseq",
                startValue: 200L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "sizeseq",
                incrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "productseq",
                incrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "colorseq",
                incrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "categoryseq",
                incrementBy: 10);

            migrationBuilder.AlterSequence(
                name: "brandseq",
                incrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "sizeseq",
                startValue: 1L);

            migrationBuilder.RestartSequence(
                name: "productseq",
                startValue: 1L);

            migrationBuilder.RestartSequence(
                name: "colorseq",
                startValue: 1L);

            migrationBuilder.RestartSequence(
                name: "categoryseq",
                startValue: 1L);

            migrationBuilder.RestartSequence(
                name: "brandseq",
                startValue: 1L);
        }
    }
}
