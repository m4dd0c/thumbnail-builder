namespace Server.Services;

public interface IGeminiService
{
    Task<List<string>> GenerateImagesAsync(string prompt, int count = 2);
    Task<List<string>> GenerateImagesAsync(
        string prompt,
        string? base64Image = null,
        int count = 2
    );
}
