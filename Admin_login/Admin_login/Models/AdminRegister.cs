using System.ComponentModel.DataAnnotations;

namespace Admin_login.Models
{
    public class AdminRegister
    {
        [Required]
        [MinLength(3, ErrorMessage = "Admin name must be at least 3 characters.")]
        public required string AdminName { get; set; }

        [Required]
        [EmailAddress]
        public  required string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public required string Password { get; set; }

        public Guid? AdminId { get; set; }

        public DateTime? CreatedAt { get; set; }

        public Guid? CreatedBy { get; set; }
    }
}