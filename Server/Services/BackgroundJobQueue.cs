using System.Threading.Channels;

namespace Server.Services;

public class BackgroundJobQueue : IBackgroundJobQueue
{
    private readonly Channel<Guid> _queue;

    public BackgroundJobQueue(int capacity = 100)
    {
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.Wait,
        };
        _queue = Channel.CreateBounded<Guid>(options);
    }

    public void QueueJob(Guid jobId)
    {
        if (!_queue.Writer.TryWrite(jobId))
        {
            throw new InvalidOperationException("Failed to queue job - queue is full");
        }
    }

    public async Task<Guid> DequeueAsync(CancellationToken cancellationToken)
    {
        return await _queue.Reader.ReadAsync(cancellationToken);
    }
}
