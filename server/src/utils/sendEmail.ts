import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'maddison53@ethereal.email',
    pass: 'jn7jnAPss4f63QBp6D'
  },
  tls: {
    rejectUnauthorized: false // avoid nodejs self signed certificate error
  }
});

export const sendEmail = async (to: string, html: string) => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to,
    subject: 'Change password',
    html
  });

  console.log('Message sent: %s', info);
};
