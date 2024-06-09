namespace Identity.API.DTOs.Roles
{
    public class RoleUpdateRequest
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
    }
}
