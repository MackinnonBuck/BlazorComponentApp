using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorComponentApp
{
    public class Global
    {
        public static IServiceProvider ServiceProvider { get; set; }

        public Global(IServiceProvider provider)
        {
            ServiceProvider = provider ?? throw new ArgumentNullException(nameof(provider)); 
        }

    }
}
