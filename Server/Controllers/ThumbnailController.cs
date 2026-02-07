using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Model;
using Server.Model.DTOs;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ThumbnailController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IBackgroundJobQueue _jobQueue;
    private readonly ILogger<ThumbnailController> _logger;

    public ThumbnailController(
        ApplicationDbContext context,
        IBackgroundJobQueue jobQueue,
        ILogger<ThumbnailController> logger
    )
    {
        _context = context;
        _jobQueue = jobQueue;
        _logger = logger;
    }

    /// <summary>
    /// Create a new thumbnail generation job
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ThumbnailJobResponse>> CreateThumbnailJob(
        [FromBody] CreateThumbnailRequest request
    )
    {
        // Get user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { message = "Invalid token" });

        // Create new job
        var job = new ThumbnailJob
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Prompt = request.Prompt,
            InputImageBase64 = request.Image, // Save the optional input image
            Status = JobStatus.Pending,
            CreatedAt = DateTime.UtcNow,
        };

        _context.ThumbnailJobs.Add(job);
        await _context.SaveChangesAsync();

        // Enqueue job for background processing
        _jobQueue.QueueJob(job.Id);

        _logger.LogInformation("Created thumbnail job {JobId} for user {UserId}", job.Id, userId);

        return Ok(new ThumbnailJobResponse { JobId = job.Id, Status = job.Status.ToString() });
    }

    /// <summary>
    /// Get the status of a thumbnail generation job
    /// </summary>
    [HttpGet("{jobId}/status")]
    public async Task<ActionResult<ThumbnailStatusResponse>> GetJobStatus(Guid jobId)
    {
        // Get user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { message = "Invalid token" });

        // Find job
        var job = await _context
            .ThumbnailJobs.Where(j => j.Id == jobId && j.UserId == userId)
            .FirstOrDefaultAsync();

        if (job == null)
            return NotFound(new { message = "Job not found" });

        var response = new ThumbnailStatusResponse { Status = job.Status.ToString() };

        // If completed, include images
        if (job.Status == JobStatus.Completed)
        {
            response.Images = new List<string>();

            if (!string.IsNullOrEmpty(job.Image1Base64))
                response.Images.Add(job.Image1Base64);

            if (!string.IsNullOrEmpty(job.Image2Base64))
                response.Images.Add(job.Image2Base64);
        }

        // If failed, include error message
        if (job.Status == JobStatus.Failed)
        {
            response.ErrorMessage = job.ErrorMessage;
        }

        return Ok(response);
    }
}
