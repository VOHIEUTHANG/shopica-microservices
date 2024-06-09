namespace Identity.API.DTOs.Addresses
{
    public class AddressResponse
    {
        public int Id { get; set; }
        public int ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string WardCode { get; set; }
        public string WardName { get; set; }
        public string Street { get; set; }
        public string FullAddress { get; set; }
    }
}
