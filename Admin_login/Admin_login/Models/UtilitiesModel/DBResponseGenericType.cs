namespace Admin_login.Utilities
{ 
    public class DBResponseGenericType<T>
    {
        public bool IsSucceed { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }
}
