import nodemailer from "nodemailer";

// Use dynamic import to properly handle mailgen in Next.js
// This ensures proper module resolution for CommonJS packages
const getMailgen = async () => {
  try {
    // Try ESM import first
    const mailgenModule = await import("mailgen");
    return mailgenModule.default || mailgenModule;
  } catch {
    // Fallback to CommonJS require
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const mailgenModule = require("mailgen");
    return mailgenModule.default || mailgenModule;
  }
};

// Cache the Mailgen constructor
let MailgenCache = null;

const sendEmail = async (options) => {
  // Get Mailgen constructor (cached after first call)
  if (!MailgenCache) {
    MailgenCache = await getMailgen();
  }
  
  try {
    const mailGenerator = new MailgenCache({
      theme: "default",
      product: {
        name: "Task Manager",
        link: "https://taskmanagelink.com",
      },
    });

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });
    const mail = {
      from: "mail.taskmanager@example.com",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    };

    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Mailgen error:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

const emailVerificationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
