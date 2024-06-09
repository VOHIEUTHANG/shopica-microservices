using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.API.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFullTextIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string addProductFullTextIndex = @"
                    IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Products]'))
                    ALTER FULLTEXT INDEX ON [dbo].[Products] DISABLE

                    GO
                    IF  EXISTS (SELECT * FROM sys.fulltext_indexes fti WHERE fti.object_id = OBJECT_ID(N'[dbo].[Products]'))
                    BEGIN
	                    DROP FULLTEXT INDEX ON [dbo].[Products]
                    End

                    Go
                    IF EXISTS (SELECT * FROM sys.fulltext_catalogs WHERE [name]='FTProducts')
                    BEGIN
	                    DROP FULLTEXT CATALOG FTProducts
                    END

                    CREATE FULLTEXT CATALOG FTProducts AS DEFAULT;
                    CREATE FULLTEXT INDEX ON dbo.Products(ProductName) KEY INDEX [PK_Products] ON FTProducts WITH CHANGE_TRACKING AUTO;

                  ";
            migrationBuilder.Sql(addProductFullTextIndex, true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            string removeProductFullTextIndex = @"
                    DROP FULLTEXT INDEX on dbo.Products;
                    DROP FULLTEXT CATALOG FTProducts;
                  ";
            migrationBuilder.Sql(removeProductFullTextIndex, true);
        }
    }
}
