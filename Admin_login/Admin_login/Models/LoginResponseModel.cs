namespace Admin_login.Models
{
    public class LoginResponseModel
    {
        public required  int AdminId { get; set; }

        public required string AdminName { get; set; }

        public required  string Email { get; set; }

        public required string PasswordHash { get; set; }
    }
}