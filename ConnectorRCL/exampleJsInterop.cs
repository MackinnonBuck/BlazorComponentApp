using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomRCL
{
    // This class provides an example of how JavaScript functionality can be wrapped
    // in a .NET class for easy consumption. The associated JavaScript module is
    // loaded on demand when first needed.
    //
    // This class can be registered as scoped DI service and then injected into Blazor
    // components for use.

    public class exampleJsInterop : IAsyncDisposable
    {
        private readonly Lazy<Task<IJSObjectReference>> moduleTask;

        public exampleJsInterop(IJSRuntime jsRuntime)
        {
            moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
                "import", "./_content/wwwroot/exampleJsInterop.js").AsTask());
        }

        public async ValueTask<string> Prompt(string message)
        {
            var module = await moduleTask.Value;
            return await module.InvokeAsync<string>("showPrompt", message);
        }

        public async ValueTask<string> CallJS(string functionName, string msg)
        {
            var module = await moduleTask.Value;
            return await module.InvokeAsync<string>(functionName, msg);
        }

        public async ValueTask DisposeAsync()
        {
            if (moduleTask.IsValueCreated)
            {
                var module = await moduleTask.Value;
                await module.DisposeAsync();
            }
        }
    }
}