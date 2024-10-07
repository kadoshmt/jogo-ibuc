export interface IEmailService {
  sendMail(options: SendMailOptions): Promise<void>;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  context: any;
}
