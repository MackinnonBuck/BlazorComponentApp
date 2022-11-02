using ConnectorLib;

namespace BlazorComponentApp;


public partial class MainPage : ContentPage
{
	public MainPage()
	{
		InitializeComponent();

        //        _notifier = Application.Current.Handler.MauiContext.Services.GetRequiredService<NotifierService>();

        //_notifier = Global.ServiceProvider.GetRequiredService<NotifierService>();
        _connectService = Global.ServiceProvider.GetRequiredService<ConnectorService>();

    }

    //private NotifierService _notifier;
    private ConnectorService _connectService;

    private void loadNewChart(object sender, EventArgs e)
    {
        string jsLoadNewChart = File.ReadAllText("C:\\DebugLabs\\Blazor\\repo_blazor_component\\BlazorComponentApp\\BlazorComponentApp\\loadnewchart.txt");
        _connectService.Update("executejs", jsLoadNewChart);

    }

    private void updateData(object sender, EventArgs e)
    {
        string jsUpdateData = File.ReadAllText("C:\\DebugLabs\\Blazor\\repo_blazor_component\\BlazorComponentApp\\updatedata.txt");
        _connectService.Update("executejs", jsUpdateData);

    }

	private void postMessageReady(object sender, EventArgs e)
	{
		_connectService.ExecuteJS("PostMessageReady", "");

	}

	private void chartInit(object sender, EventArgs e)
	{
		_connectService.ExecuteJS("ChartInit", "");

	}

	private void displayPrompt(object sender, EventArgs e)
	{
		_connectService.ExecuteJS("displayPrompt", "hello world");
		
	}
}
