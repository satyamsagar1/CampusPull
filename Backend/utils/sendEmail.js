import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;


client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (options) => {
  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.FROM_MAIL ,
        name: "CampusPull",
      },
      to: [
        {
          email: options.email,
        },
      ],
      subject: options.subject,
      htmlContent: options.message,
    });
  } catch (error) {
    console.error(
      "EMAIL SENDING FAILED (BREVO API)",
      error.response?.body || error
    );
  }
};

export default sendEmail;
