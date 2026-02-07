using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Model;

namespace Server.Services;

public class ThumbnailWorkerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IBackgroundJobQueue _jobQueue;
    private readonly ILogger<ThumbnailWorkerService> _logger;

    public ThumbnailWorkerService(
        IServiceProvider serviceProvider,
        IBackgroundJobQueue jobQueue,
        ILogger<ThumbnailWorkerService> logger
    )
    {
        _serviceProvider = serviceProvider;
        _jobQueue = jobQueue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Thumbnail Worker Service is starting");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var jobId = await _jobQueue.DequeueAsync(stoppingToken);
                await ProcessJobAsync(jobId, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when stopping
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in worker service main loop");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        _logger.LogInformation("Thumbnail Worker Service is stopping");
    }

    private async Task ProcessJobAsync(Guid jobId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var geminiService = scope.ServiceProvider.GetRequiredService<IGeminiService>();

        try
        {
            // Load job from database
            var job = await context.ThumbnailJobs.FindAsync(
                new object[] { jobId },
                cancellationToken
            );

            if (job == null)
            {
                _logger.LogWarning("Job {JobId} not found in database", jobId);
                return;
            }

            _logger.LogInformation(
                "Processing job {JobId} with prompt: {Prompt}",
                jobId,
                job.Prompt
            );

            // Update status to Processing
            job.Status = JobStatus.Processing;
            await context.SaveChangesAsync(cancellationToken);

            // Build the enhanced prompt with YouTube thumbnail context
            var enhancedPrompt = BuildYouTubeThumbnailPrompt(job.Prompt, job.InputImageBase64);

            // Call Gemini API to generate images
            var images = await geminiService.GenerateImagesAsync(
                enhancedPrompt,
                job.InputImageBase64, // Pass the input image if available
                2
            );

            // Store images in database
            if (images.Count >= 1)
                job.Image1Base64 = images[0];

            if (images.Count >= 2)
                job.Image2Base64 = images[1];

            // Update status to Completed
            job.Status = JobStatus.Completed;
            job.CompletedAt = DateTime.UtcNow;

            await context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Job {JobId} completed successfully", jobId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing job {JobId}", jobId);

            try
            {
                var job = await context.ThumbnailJobs.FindAsync(
                    new object[] { jobId },
                    cancellationToken
                );
                if (job != null)
                {
                    job.Status = JobStatus.Failed;
                    job.ErrorMessage = ex.Message;
                    job.CompletedAt = DateTime.UtcNow;
                    await context.SaveChangesAsync(cancellationToken);
                }
            }
            catch (Exception saveEx)
            {
                _logger.LogError(saveEx, "Failed to update job {JobId} status to Failed", jobId);
            }
        }
    }

    /// <summary>
    /// Builds an enhanced prompt with YouTube thumbnail best practices
    /// </summary>
    private string BuildYouTubeThumbnailPrompt(string userPrompt, string? inputImage)
    {
        var systemContext =
            @"Create a YouTube thumbnail that follows these best practices:
- Eye-catching and attention-grabbing design
- Always generate 16:9 ratio thumbnail
- Bold, readable text that stands out
- High contrast colors for visibility
- Clear focal point (face, product, or main subject)
- Professional quality and composition
- Optimized for small screens (mobile-friendly)
- Conveys the video's content at a glance";

        if (!string.IsNullOrEmpty(inputImage))
        {
            systemContext +=
                @"
- Use the provided reference image as a style guide or incorporate its elements
- Match the aesthetic, color scheme, or composition of the reference image";
        }

        return $"{systemContext}\n\nUser Request: {userPrompt}";
    }
}
