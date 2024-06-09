using AutoMapper;
using Catalog.API.DTOs.Brands;
using Catalog.API.DTOs.Categories;
using Catalog.API.DTOs.Colors;
using Catalog.API.DTOs.ProductColors;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.DTOs.Products;
using Catalog.API.DTOs.ProductSizes;
using Catalog.API.DTOs.Sizes;
using Catalog.API.Models;

namespace Catalog.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Category, CategoryResponse>();
            CreateMap<CategoryCreateRequest, Category>();

            CreateMap<Color, ColorResponse>();
            CreateMap<ColorCreateRequest, Color>();

            CreateMap<Size, SizeResponse>();
            CreateMap<SizeCreateRequest, Size>();

            CreateMap<Brand, BrandResponse>();
            CreateMap<BrandCreateRequest, Brand>();

            CreateMap<ProductCreateRequest, Product>();
            CreateMap<Product, ProductResponse>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(i => i.Brand.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(i => i.Category.CategoryName));

            CreateMap<ProductColorCreateRequest, ProductColor>();
            CreateMap<ProductColor, ProductColorResponse>()
                .ForMember(dest => dest.ColorName, opt => opt.MapFrom(i => i.Color.ColorName))
                .ForMember(dest => dest.ColorCode, opt => opt.MapFrom(i => i.Color.ColorCode));

            CreateMap<ProductSizeCreateRequest, ProductSize>();
            CreateMap<ProductSize, ProductSizeResponse>()
                .ForMember(dest => dest.SizeName, opt => opt.MapFrom(i => i.Size.SizeName));

            CreateMap<ProductImageCreateRequest, ProductImage>();
            CreateMap<ProductImage, ProductImageResponse>();
        }
    }
}
