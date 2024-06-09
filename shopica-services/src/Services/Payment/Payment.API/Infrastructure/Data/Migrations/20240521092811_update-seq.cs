using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateseq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "paymentmethodseq",
                oldIncrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "paymentmethodseq",
                startValue: 200L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "paymentmethodseq",
                incrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "paymentmethodseq",
                startValue: 1L);
        }
    }
}
