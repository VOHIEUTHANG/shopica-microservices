using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ratting.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateseq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "blogseq",
                oldIncrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "blogseq",
                startValue: 200L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterSequence(
                name: "blogseq",
                incrementBy: 10);

            migrationBuilder.RestartSequence(
                name: "blogseq",
                startValue: 1L);
        }
    }
}
