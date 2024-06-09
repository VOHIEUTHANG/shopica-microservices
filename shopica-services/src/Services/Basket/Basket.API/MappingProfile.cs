using AutoMapper;
using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.Carts;
using Basket.API.DTOs.PromotionCalculations;
using Basket.API.DTOs.PromotionResults;
using Basket.API.DTOs.Promotions;
using Basket.API.DTOs.Wishlists;
using Basket.API.Models;

namespace Basket.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Promotion, PromotionResponse>();
            CreateMap<Promotion, PromotionApplyResponse>();
            CreateMap<Promotion, PromotionResult>()
                .ForMember(p => p.PromotionCode, opt => opt.MapFrom(i => i.Code))
                .ForMember(p => p.PromotionType, opt => opt.MapFrom(i => i.Type));

            CreateMap<PromotionCreateRequest, Promotion>();

            CreateMap<Wishlist, WishlistResponse>();
            CreateMap<WishlistCreateRequest, Wishlist>();

            CreateMap<Cart, CartResponse>();
            CreateMap<CartCreateRequest, Cart>();

            CreateMap<CartItem, CartItemResponse>();
            CreateMap<CartItemCreateRequest, CartItem>();

            CreateMap<PromotionResult, PromotionResultResponse>();
        }
    }
}
