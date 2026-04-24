using System.ComponentModel.DataAnnotations;

namespace Admin_login.Models
{
    public class AdminLogin
    {
        public  required  string Email { get; set; }

        public required string Password { get; set; }
    }
}