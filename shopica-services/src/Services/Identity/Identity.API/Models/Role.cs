namespace Identity.API.Models
{
    public class Role : BaseEntity
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }
        public IEnumerable<User> Users { get; set; }
    }
}
