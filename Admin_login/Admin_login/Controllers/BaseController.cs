using Admin_login.Models;
using Admin_login.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Admin_login.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected IActionResult ApiResponse<T>(
            HttpStatusCode statusCode,
            string message,
            T data = default,
            bool isSuccess = true)
        {
            var response = new ApiBaseResponse<T>
            {
                StatusCode = statusCode,
                Message = message,
                Data = data,
                IsSuccess = isSuccess
            };

            return StatusCode((int)statusCode, response);
        }
    }
}