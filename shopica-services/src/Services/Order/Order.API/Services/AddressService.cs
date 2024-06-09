using AutoMapper;
using Ordering.API.DTOs;
using Ordering.API.DTOs.Addresses;
using Ordering.API.Infrastructure;
using Ordering.API.Interfaces;
using Ordering.API.Models;
using Ordering.API.Specifications.Addresses;

namespace Ordering.API.Services
{
    public class AddressService : IAddressService
    {
        private readonly IOrderingRepository<Address> _addressRepository;
        private readonly IMapper _mapper;
        public AddressService(
           IOrderingRepository<Address> addressRepository,
           IMapper mapper)
        {
            _addressRepository = addressRepository;
            _mapper = mapper;
        }
        public async Task<AddressResponse> CreateAsync(AddressCreateRequest request)
        {
            var address = _mapper.Map<Address>(request);

            if (address.Default)
            {
                await MakeUnDefaultAddress(request.CustomerId);
            }

            await _addressRepository.AddAsync(address);
            await _addressRepository.SaveChangesAsync();
            return _mapper.Map<AddressResponse>(address);
        }

        public async Task<bool> DeleteAsync(int addressId)
        {
            var address = await _addressRepository.FirstOrDefaultAsync(new AddressByIdSpec(addressId));
            if (address is null) throw new ArgumentException($"Can not find address with key: {addressId}");

            await _addressRepository.DeleteAsync(address);
            await _addressRepository.SaveChangesAsync();
            return true;
        }


        public async Task<PaginatedResult<AddressResponse>> GetAllAsync(BaseParam param, int customerId)
        {
            var spec = new AddressPaginatedFilteredSpec(param, customerId);
            var addresses = await _addressRepository.ListAsync(spec);
            var totalRecords = await _addressRepository.CountAsync(new AddressFilteredSpec(customerId));
            var addressesResponse = _mapper.Map<IEnumerable<AddressResponse>>(addresses);
            return new PaginatedResult<AddressResponse>(param.PageIndex, param.PageSize, totalRecords, addressesResponse);
        }

        public async Task<AddressResponse> GetByIdAsync(int addressId)
        {
            var address = await _addressRepository.FirstOrDefaultAsync(new AddressByIdSpec(addressId));
            if (address is null) throw new ArgumentException($"Can not find address with key: {addressId}");
            var result = _mapper.Map<AddressResponse>(address);
            return result;
        }

        public async Task<AddressResponse> GetDefaultAddressAsync(int customerId)
        {
            var address = await _addressRepository.FirstOrDefaultAsync(new AddressByDefaultSpec(customerId));
            if (address is null)
            {
                address = await _addressRepository.FirstOrDefaultAsync(new AddressByCustIdSpec(customerId));
            }

            var result = _mapper.Map<AddressResponse>(address);
            return result;
        }

        public async Task<AddressResponse> UpdateAsync(AddressUpdateRequest request)
        {
            var address = await _addressRepository.FirstOrDefaultAsync(new AddressByIdSpec(request.Id));
            if (address is null) throw new ArgumentException($"Can not find address with key: {request.Id}");

            address.CustomerName = request.CustomerName ?? address.CustomerName;
            address.Phone = request.Phone ?? address.Phone;
            address.ProvinceId = request.ProvinceId;
            address.ProvinceName = request.ProvinceName ?? address.ProvinceName;
            address.DistrictId = request.DistrictId;
            address.DistrictName = request.DistrictName ?? address.DistrictName;
            address.WardCode = request.WardCode ?? address.WardCode;
            address.WardName = request.WardName ?? address.WardName;
            address.Street = request.Street ?? address.Street;
            address.FullAddress = request.FullAddress ?? address.FullAddress;

            if (request.Default)
            {
                await MakeUnDefaultAddress(request.CustomerId);
            }

            address.Default = request.Default;

            await _addressRepository.UpdateAsync(address);
            await _addressRepository.SaveChangesAsync();

            return _mapper.Map<AddressResponse>(address);
        }


        private async Task MakeUnDefaultAddress(int customerId)
        {
            var addresses = await _addressRepository.ListAsync(new AddressByDefaultSpec(customerId));

            foreach (var address in addresses)
            {
                address.Default = false;
            }

            await _addressRepository.UpdateRangeAsync(addresses);
            await _addressRepository.SaveChangesAsync();
        }
    }
}
