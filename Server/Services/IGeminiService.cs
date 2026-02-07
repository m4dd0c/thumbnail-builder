namespace Server.Services;

public interface IGeminiService
{
    Task<List<string>> GenerateImagesAsync(string prompt, int count = 2);
}
