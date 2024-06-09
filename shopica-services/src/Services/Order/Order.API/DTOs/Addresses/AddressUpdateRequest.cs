namespace Ordering.API.DTOs.Addresses
{
    public class AddressUpdateRequest
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string WardCode { get; set; }
        public string WardName { get; set; }
        public string Street { get; set; }
        public string FullAddress { get; set; }
        public bool Default { get; set; }
    }
}
