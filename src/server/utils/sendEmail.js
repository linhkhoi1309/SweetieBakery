import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    //Tạo transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: '"Sweetie Bakery" <noreply@sweetiebakery.com>',
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;