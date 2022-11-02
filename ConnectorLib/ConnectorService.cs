using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectorLib
{
    public class ConnectorService : IConnectorService
    {
        public async Task Update(string messageType, string messageBody)
        {
            if (OnUpdate != null)
            {
                await OnUpdate.Invoke(messageType, messageBody);
            }
        }
		public async Task ExecuteJS(string jsFunction, string messageBody)
		{
			if (OnExecuteJS != null)
			{
				await OnExecuteJS.Invoke(jsFunction, messageBody);
			}
		}

		public event Func<string, string, Task>? OnUpdate;
        public event Func<string, string, Task>? OnExecuteJS;
	}

    public interface IConnectorService
    {
        public Task Update(string messageType, string messageBody);
        public event Func<string, string, Task>? OnUpdate;
        public event Func<string, string, Task>? OnExecuteJS;

	}
}
