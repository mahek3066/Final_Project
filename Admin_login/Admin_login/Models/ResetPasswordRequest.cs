using System.ComponentModel.DataAnnotations;

namespace Admin_login.Models
{
    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "Email is required")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Reset token is required")]
        public required string ResetToken { get; set; }

        [Required(ErrorMessage = "New password is required")]
        public required string NewPassword { get; set; }
    }
}