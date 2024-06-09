using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ratting.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAction_Comment_CommentId",
                table: "UserAction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAction",
                table: "UserAction");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comment",
                table: "Comment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Blog",
                table: "Blog");

            migrationBuilder.RenameTable(
                name: "UserAction",
                newName: "UserActions");

            migrationBuilder.RenameTable(
                name: "Comment",
                newName: "Comments");

            migrationBuilder.RenameTable(
                name: "Blog",
                newName: "Blogs");

            migrationBuilder.RenameIndex(
                name: "IX_UserAction_CommentId",
                table: "UserActions",
                newName: "IX_UserActions_CommentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserActions",
                table: "UserActions",
                columns: new[] { "UserId", "CommentId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                table: "Comments",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Blogs",
                table: "Blogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserActions_Comments_CommentId",
                table: "UserActions",
                column: "CommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserActions_Comments_CommentId",
                table: "UserActions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserActions",
                table: "UserActions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comments",
                table: "Comments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Blogs",
                table: "Blogs");

            migrationBuilder.RenameTable(
                name: "UserActions",
                newName: "UserAction");

            migrationBuilder.RenameTable(
                name: "Comments",
                newName: "Comment");

            migrationBuilder.RenameTable(
                name: "Blogs",
                newName: "Blog");

            migrationBuilder.RenameIndex(
                name: "IX_UserActions_CommentId",
                table: "UserAction",
                newName: "IX_UserAction_CommentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAction",
                table: "UserAction",
                columns: new[] { "UserId", "CommentId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comment",
                table: "Comment",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Blog",
                table: "Blog",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAction_Comment_CommentId",
                table: "UserAction",
                column: "CommentId",
                principalTable: "Comment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
