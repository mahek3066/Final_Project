using System.Data;
using System.Reflection;

namespace Admin_login.Utilities
{
    public class ValueConverter
    {
        public static T ConvertToObject<T>(DataRow row)
        {
            if (row == null)
                return default;

            T obj = Activator.CreateInstance<T>();

            foreach (PropertyInfo prop in typeof(T).GetProperties())
            {
                if (row.Table.Columns.Contains(prop.Name) && row[prop.Name] != DBNull.Value)
                {
                    prop.SetValue(obj, Convert.ChangeType(row[prop.Name], prop.PropertyType));
                }
            }

            return obj;
        }

        public static List<T> ConvertToList<T>(DataRowCollection rows)
        {
            List<T> list = new List<T>();

            if (rows == null)
                return list;

            foreach (DataRow row in rows)
            {
                list.Add(ConvertToObject<T>(row));
            }

            return list;
        }
    }
}