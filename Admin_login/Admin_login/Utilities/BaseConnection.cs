using Admin_login.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Admin_login.Utilities
{
    public class BaseConnection
    {
        private readonly string _connectionString;

        public BaseConnection(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public ApiBaseResponse<T> ExecuteSingle<T>(string procedure, Dictionary<string, object> parameters = null)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand(procedure, conn);

                cmd.CommandType = CommandType.StoredProcedure;

                if (parameters != null)
                {
                    foreach (var param in parameters)
                    {
                        cmd.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                    }
                }

                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();

                conn.Open();
                adapter.Fill(ds);

                var row = ds.Tables[0].Rows[0];

                var data = ValueConverter.ConvertToObject<T>(row);

                return new ApiBaseResponse<T>
                {
                    IsSuccess = true,
                    Data = data,
                    Message = "Success",
                    StatusCode = System.Net.HttpStatusCode.OK
                };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<T>
                {
                    IsSuccess = false,
                    Message = ex.Message,
                    StatusCode = System.Net.HttpStatusCode.InternalServerError
                };
            }
        }

        public ApiBaseResponse<List<T>> ExecuteList<T>(string procedure, Dictionary<string, object> parameters = null)
        {
            try
            {
                using SqlConnection conn = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand(procedure, conn);

                cmd.CommandType = CommandType.StoredProcedure;

                if (parameters != null)
                {
                    foreach (var param in parameters)
                    {
                        cmd.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                    }
                }

                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();

                conn.Open();
                adapter.Fill(ds);

                var rows = ds.Tables[0].Rows;

                var data = ValueConverter.ConvertToList<T>(rows);

                return new ApiBaseResponse<List<T>>
                {
                    IsSuccess = true,
                    Data = data,
                    Message = "Success",
                    StatusCode = System.Net.HttpStatusCode.OK
                };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<List<T>>
                {
                    IsSuccess = false,
                    Message = ex.Message,
                    StatusCode = System.Net.HttpStatusCode.InternalServerError
                };
            }
        }
    }
}