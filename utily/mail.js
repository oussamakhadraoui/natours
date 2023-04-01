const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Eamil {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `oussama khadraoui <${process.env.EMAIL_SENDER}>`;
    // this.from = `ahmed.khadhraoui@fst.utm.tn`;
  }
  transporter() {
    if (process.env.NODE_ENV.trim() === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL_USER2,
          pass: process.env.EMAIL_PASSWORD2,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendEmail(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOption = {
      from: this.from,
      to: this.to,
      envelope: {
        from: 'Daemon <deamon@nodemailer.com>', // used as MAIL FROM: address for SMTP
        to: 'mailer@nodemailer.com, Mailer <mailer2@nodemailer.com>', // used as RCPT TO: address for SMTP
      },
      html,
      subject,
      text: htmlToText.convert(html),
    };
    await this.transporter().sendMail(mailOption);
  }
  async sendWelcome() {
    await this.sendEmail('welcome', 'welcome to the natours family amigo!!!!');
  }
  async sendReset() {
    await this.sendEmail(
      'reset',
      'Your password reset Token is valid for only 10 min'
    );
  }
};

// const sendEmail = async (option) => {
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: 2525,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
// const mailOption = {
//   from: 'oussama khadraoui <black0velta@gmail.com>',
//   to: option.email,
//   envelope: {
//     from: 'Daemon <deamon@nodemailer.com>', // used as MAIL FROM: address for SMTP
//     to: 'mailer@nodemailer.com, Mailer <mailer2@nodemailer.com>', // used as RCPT TO: address for SMTP
//   },
//   subject: option.subject,
//   text: option.text,
// };
//   await transporter.sendMail(mailOption);
// };

// module.exports = sendEmail;
