import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true, 
    auth: {
      user: process.env.SMPT_LOGIN, 
      pass: process.env.SMPT_PASSWORD, 
    },
  });

  const mailOptions = {
    from: `"CampusPull" <${process.env.SMPT_MAIL}>`, 
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
