namespace Server.Services;

public interface IBackgroundJobQueue
{
    void QueueJob(Guid jobId);
    Task<Guid> DequeueAsync(CancellationToken cancellationToken);
}
