
using Admin_login.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;


namespace Admin_login.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // REGISTER ADMIN
        [HttpPost("register")]
        public IActionResult Register(AdminRegister admin)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                using SqlConnection conn = new SqlConnection(connectionString);
                using SqlCommand cmd = new SqlCommand("Insert_Admin", conn);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                PasswordHasher<string> hasher = new PasswordHasher<string>();
                string hashedPassword = hasher.HashPassword(null, admin.Password);

                cmd.Parameters.Add("@AdminName", System.Data.SqlDbType.NVarChar).Value = admin.AdminName;
                cmd.Parameters.Add("@Email", System.Data.SqlDbType.NVarChar).Value = admin.Email;
                cmd.Parameters.Add("@PasswordHash", System.Data.SqlDbType.NVarChar).Value = hashedPassword;

                conn.Open();

                using SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    return Ok(new
                    {
                        message = "Admin Registered Successfully",
                        AdminId = reader["AdminId"],
                        AdminName = reader["AdminName"],
                        Email = reader["Email"]
                    });
                }

                return BadRequest("Registration failed");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // LOGIN ADMIN
        [HttpPost("login")]
        public IActionResult Login(AdminLogin login)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                Guid adminId;
                string adminName;
                string storedHash;

                using SqlConnection conn = new SqlConnection(connectionString);
                using SqlCommand cmd = new SqlCommand("Admin_Login", conn);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add("@Email", System.Data.SqlDbType.NVarChar).Value = login.Email;

                conn.Open();

                using SqlDataReader reader = cmd.ExecuteReader();

                if (!reader.Read())
                    return Unauthorized("Invalid Email");

                adminId = (Guid)reader["AdminId"];
                adminName = reader["AdminName"].ToString();
                storedHash = reader["PasswordHash"].ToString();

                PasswordHasher<string> hasher = new PasswordHasher<string>();

                var result = hasher.VerifyHashedPassword(null, storedHash, login.Password);

                if (result != PasswordVerificationResult.Success)
                    return Unauthorized("Invalid Password");

                string token = GenerateJwtToken(adminId, adminName, login.Email);

                return Ok(new
                {
                    message = "Login Successful",
                    data = new
                    {
                        AdminId = adminId,
                        AdminName = adminName,
                        Email = login.Email,
                        Token = token
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GENERATE JWT TOKEN
        private string GenerateJwtToken(Guid adminId, string adminName, string email)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, adminName),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim("AdminId", adminId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(jwtSettings["ExpiresInMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // FORGOT PASSWORD
        /*[HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                using SqlConnection conn = new SqlConnection(connectionString);
                using SqlCommand cmd = new SqlCommand("Generate_ResetToken", conn);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add("@Email", System.Data.SqlDbType.NVarChar).Value = request.Email;

                await conn.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                    return BadRequest("Failed to generate reset token");

                int success = Convert.ToInt32(reader["Success"]);

                if (success == 0)
                    return NotFound("Email not found");

                string resetToken = reader["ResetToken"].ToString();

                return Ok(new
                {
                    message = "Reset token generated",
                    resetToken,
                    email = request.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }*/
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                using SqlConnection conn = new SqlConnection(connectionString);
                using SqlCommand cmd = new SqlCommand("Generate_ResetToken", conn);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", request.Email);

                await conn.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                    return BadRequest("Failed");

                int success = Convert.ToInt32(reader["Success"]);

                if (success == 0)
                    return NotFound("Email not found");

                string resetToken = reader["ResetToken"].ToString();

                // ✅ CREATE RESET LINK
                string resetLink = $"https://choppiest-antonia-peskier.ngrok-free.dev/reset_password?email={request.Email}&token={resetToken}";
                // ✅ SEND EMAIL
                await SendEmail(request.Email, resetLink);

                return Ok(new { message = "Reset link sent to email" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        private async Task SendEmail(string email, string resetLink)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    emailSettings["Email"],
                    emailSettings["AppPassword"]
                ),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(emailSettings["Email"]),
                Subject = "Reset Password",
                Body = $@"
                    <h2>Password Reset</h2>
                    <p>Click the button below to reset your password:</p>
                        <a href='{resetLink}' 
                            style='padding:10px 15px; background-color:blue; color:white; text-decoration:none;'>
                                Reset Password
                                </a>",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // =============================
            // BASIC VALIDATION
            // =============================
            if (request == null)
                return BadRequest("Invalid request");

            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            if (string.IsNullOrEmpty(request.ResetToken))
                return BadRequest("Reset token is required");

            if (string.IsNullOrEmpty(request.NewPassword))
                return BadRequest("New password is required");

            // =============================
            // VALIDATE TOKEN FORMAT
            // =============================
            if (!Guid.TryParse(request.ResetToken, out Guid tokenGuid))
                return BadRequest("Invalid reset token format");

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");

                using SqlConnection conn = new SqlConnection(connectionString);
                using SqlCommand cmd = new SqlCommand("Reset_AdminPassword", conn);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                // Hash password
                var hasher = new PasswordHasher<string>();
                string hashedPassword = hasher.HashPassword(null, request.NewPassword);

                // Parameters
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = request.Email;
                cmd.Parameters.Add("@ResetToken", SqlDbType.UniqueIdentifier).Value = tokenGuid;
                cmd.Parameters.Add("@NewPasswordHash", SqlDbType.NVarChar).Value = hashedPassword;

                await conn.OpenAsync();

                using SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    int success = reader["Success"] != DBNull.Value
                        ? Convert.ToInt32(reader["Success"])
                        : 0;

                    if (success == 1)
                        return Ok(new { message = "Password reset successful" });
                }

                return BadRequest(new { message = "Invalid token or email" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }
    }
}