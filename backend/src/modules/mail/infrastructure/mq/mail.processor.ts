import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../../application/mail.service';

@Processor('email_queue_bull')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: MailService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { to, subject, html, type } = job.data;
    
    if (job.name === 'send-email') {
      await this.emailService.sendMail(to, subject, html, type);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`✅ Email Job completed: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.log(`❌ Email Job failed: ${job.id}`, err.message);
  }
}
