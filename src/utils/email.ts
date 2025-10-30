import * as nodemailer from 'nodemailer';

export const sendEmail = async (options: nodemailer.SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(options);
};
