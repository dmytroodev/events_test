import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
};

const connection = new IORedis(redisUrl, redisOptions);

export interface RegistrationJobPayload {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
}

export const registrationQueue = new Queue<RegistrationJobPayload>('event-registrations', {
  connection,
});

const worker = new Worker<RegistrationJobPayload>(
  'event-registrations',
  async (job) => {
    const { eventId, fullName, email, phone } = job.data;
    console.log(
      `Processed registration for event ${eventId}: ${fullName} <${email}>, phone: ${phone}`,
    );
  },
  {
    connection,
  },
);

worker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});

export function enqueueRegistrationJob(payload: RegistrationJobPayload, options?: JobsOptions) {
  return registrationQueue.add('registration', payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
    ...(options || {}),
  });
}

