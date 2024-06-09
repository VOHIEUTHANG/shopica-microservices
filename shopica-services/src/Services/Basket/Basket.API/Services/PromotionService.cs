using AutoMapper;
using Basket.API.DTOs;
using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.PromotionCalculations;
using Basket.API.DTOs.Promotions;
using Basket.API.Infrastructure;
using Basket.API.Interfaces;
using Basket.API.Models;
using Basket.API.Models.Enums;
using Basket.API.Specifications.PromotionResults;
using Basket.API.Specifications.Promotions;

namespace Basket.API.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IBasketRepository<Promotion> _promotionRepository;
        private readonly IBasketRepository<PromotionResult> _promotionResultRepository;
        private readonly ICartService _cartService;
        private readonly IMapper _mapper;
        public PromotionService(
           IBasketRepository<Promotion> promotionRepository,
           IBasketRepository<PromotionResult> promotionResultRepository,
           ICartService cartService,
           IMapper mapper)
        {
            _promotionRepository = promotionRepository;
            _promotionResultRepository = promotionResultRepository;
            _cartService = cartService;
            _mapper = mapper;
        }

        public async Task<PromotionApplyResponse> ApplyPromotionAsync(PromotionApplyRequest request)
        {
            await UnApplyPromotionAsync(request.CustomerId, string.Empty);

            var promotion = await _promotionRepository.FirstOrDefaultAsync(new PromotionByCodeSpec(request.PromotionCode));
            if (promotion is null) throw new ArgumentException("Promotion code is not exist!");

            if (promotion.StartDate >= request.OrderDate || promotion.EndDate <= request.OrderDate)
                throw new ArgumentException("The promotion is expired!");

            switch (promotion.Type)
            {
                case PromotionType.Amount:
                    if (promotion.SalesByAmount <= request.TotalPrice)
                    {
                        var result = await ApplyPromotionAsync(promotion, request.CustomerId);
                        return result;
                    }
                    else
                    {
                        throw new ArgumentException($"Total price must greater or equal {promotion.SalesByAmount}!");
                    }
                case PromotionType.Discount:
                    if (promotion.SalesByAmount <= request.TotalPrice)
                    {
                        var result = await ApplyPromotionAsync(promotion, request.CustomerId);
                        return result;
                    }
                    else
                    {
                        throw new ArgumentException($"Total price must greater or equal {promotion.SalesByAmount}!");
                    }
                case PromotionType.Product:
                    var linePromotion = request.PromotionDetails.FirstOrDefault(pd => pd.ProductId == promotion.SalesById);
                    if (linePromotion is null) throw new ArgumentException("You can not use this promotion!");
                    if (promotion.SalesByQuantity <= linePromotion.Quantity)
                    {
                        CartItemCreateRequest cartItem = new CartItemCreateRequest()
                        {
                            CustomerId = request.CustomerId,
                            ProductId = promotion.PromotionById,
                            ProductName = promotion.PromotionByName,
                            ColorId = promotion.PromotionColorId,
                            SizeId = promotion.PromotionSizeId,
                            ColorName = promotion.PromotionColorName,
                            SizeName = promotion.PromotionSizeName,
                            ImageUrl = promotion.PromotionImageUrl,
                            IsPromotionLine = true,
                            PromotionCode = promotion.Code,
                            Quantity = promotion.PromotionQuantity,
                            UnitPrice = promotion.PromotionPrice,
                        };

                        await _cartService.AddToCartAsync(cartItem);

                        var result = await ApplyPromotionAsync(promotion, request.CustomerId);
                        return result;
                    }
                    else
                    {
                        throw new ArgumentException($"Quantity must greater or equal {promotion.SalesByQuantity}!");
                    }
            }

            throw new ArgumentException("You can not use this promotion!");
        }

        private async Task<PromotionApplyResponse> ApplyPromotionAsync(Promotion promotion, int customerId)
        {
            var result = _mapper.Map<PromotionApplyResponse>(promotion);
            var promotionResult = _mapper.Map<PromotionResult>(promotion);

            promotionResult.CustomerId = customerId;

            await _promotionResultRepository.AddAsync(promotionResult);
            await _promotionResultRepository.SaveChangesAsync();

            return result;
        }


        public async Task<PromotionResponse> CreateAsync(PromotionCreateRequest request)
        {
            var promotionExists = await _promotionRepository.FirstOrDefaultAsync(new PromotionByCodeSpec(request.Code));
            if (promotionExists is not null) throw new ArgumentException("Promotion code is already exist!");

            var promotion = _mapper.Map<Promotion>(request);

            await _promotionRepository.AddAsync(promotion);
            await _promotionRepository.SaveChangesAsync();
            return _mapper.Map<PromotionResponse>(promotion);
        }

        public async Task<bool> DeleteAsync(string promotionCode)
        {
            var promotion = await _promotionRepository.FirstOrDefaultAsync(new PromotionByCodeSpec(promotionCode));
            if (promotion is null) throw new ArgumentException($"Can not find promotion with key: {promotionCode}");

            await _promotionRepository.DeleteAsync(promotion);
            await _promotionRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<PromotionResponse>> GetAllAsync(BaseParam param, string? description)
        {
            var spec = new PromotionPaginatedFilteredSpec(param, description);
            var promotions = await _promotionRepository.ListAsync(spec);
            var totalRecords = await _promotionRepository.CountAsync(new PromotionFilteredSpec(description));
            var promotionsResponse = _mapper.Map<IEnumerable<PromotionResponse>>(promotions);
            return new PaginatedResult<PromotionResponse>(param.PageIndex, param.PageSize, totalRecords, promotionsResponse);
        }

        public async Task<PromotionResponse> GetByIdAsync(string promotionCode)
        {
            var promotion = await _promotionRepository.FirstOrDefaultAsync(new PromotionByCodeSpec(promotionCode));
            if (promotion is null) throw new ArgumentException($"Can not find promotion with key: {promotionCode}");
            var result = _mapper.Map<PromotionResponse>(promotion);
            return result;
        }

        public async Task<PaginatedResult<PromotionResponse>> GetValidPromotionAsync(BaseParam param, PromotionApplyRequest request)
        {
            List<PromotionResponse> responses = new List<PromotionResponse>();

            var promotionAmounts = await _promotionRepository.ListAsync(new PromotionAmountValidSpec(request.OrderDate, request.TotalPrice));

            responses.AddRange(_mapper.Map<IEnumerable<PromotionResponse>>(promotionAmounts));

            var promotionProducts = await _promotionRepository.ListAsync(new PromotionProductValidSpec(request.OrderDate));

            foreach (var item in request.PromotionDetails)
            {
                var linePromotion = promotionProducts.FirstOrDefault(pd => pd.SalesById == item.ProductId);
                if (linePromotion is null) continue;

                if (linePromotion.SalesByQuantity <= item.Quantity)
                {
                    responses.Add(_mapper.Map<PromotionResponse>(linePromotion));
                }
            }

            var result = responses.Skip(param.PageSize * (param.PageIndex - 1))
                 .Take(param.PageSize);

            return new PaginatedResult<PromotionResponse>(param.PageIndex, param.PageSize, responses.Count, result);
        }

        public async Task<PromotionResponse> UpdateAsync(PromotionUpdateRequest request)
        {
            var promotion = await _promotionRepository.FirstOrDefaultAsync(new PromotionByCodeSpec(request.Code));
            if (promotion is null) throw new ArgumentException($"Can not find promotion with key: {request.Code}");

            promotion.Description = request.Description ?? promotion.Description;
            promotion.StartDate = request.StartDate;
            promotion.EndDate = request.EndDate;
            promotion.Active = request.Active;

            switch (promotion.Type)
            {
                case PromotionType.Amount:
                    promotion.SalesByAmount = request.SalesByAmount;
                    promotion.PromotionAmount = request.PromotionAmount;
                    break;
                case PromotionType.Discount:
                    promotion.SalesByAmount = request.SalesByAmount;
                    promotion.PromotionDiscount = request.PromotionDiscount;
                    promotion.PromotionDiscountLimit = request.PromotionDiscountLimit;
                    break;
                case PromotionType.Product:
                    promotion.SalesById = request.SalesById;
                    promotion.SalesByName = request.SalesByName;
                    promotion.SalesByQuantity = request.SalesByQuantity;
                    promotion.PromotionById = request.PromotionById;
                    promotion.PromotionByName = request.SalesByName;
                    promotion.PromotionColorId = request.PromotionColorId;
                    promotion.PromotionColorName = request.PromotionColorName;
                    promotion.PromotionSizeId = request.PromotionSizeId;
                    promotion.PromotionSizeName = request.PromotionSizeName;
                    promotion.PromotionImageUrl = request.PromotionImageUrl;
                    promotion.PromotionPrice = request.PromotionPrice;
                    promotion.PromotionQuantity = request.PromotionQuantity;
                    break;
                default:
                    break;
            }

            await _promotionRepository.UpdateAsync(promotion);
            await _promotionRepository.SaveChangesAsync();

            return _mapper.Map<PromotionResponse>(promotion);
        }

        public async Task<bool> UnApplyPromotionAsync(int customerId, string promotionCode)
        {
            var promotionResults = await _promotionResultRepository.ListAsync(new PromotionResultByCustPromoCodeSpec(customerId, promotionCode));

            await _cartService.RemoveCartItemByPromotionAsync(customerId, promotionCode);

            await _promotionResultRepository.DeleteRangeAsync(promotionResults);

            await _promotionResultRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ChangePromotionResultWhenOrderCreatedAsync(int customerId, int orderId)
        {
            var promotionResults = await _promotionResultRepository.ListAsync(new PromotionResultByCustIdSpec(customerId));

            if (promotionResults.Count > 0)
            {
                for (int i = 0; i < promotionResults.Count; i++)
                {
                    promotionResults[i].OrderId = orderId;
                }

                await _promotionResultRepository.UpdateRangeAsync(promotionResults);
                await _promotionResultRepository.SaveChangesAsync();
            }

            return true;
        }
    }
}
