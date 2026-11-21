
const transporter = require("../config/email");

// Send Email
const sendEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({
                message: "Please provide to, subject and message"
            });
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message
        });

        res.status(200).json({
            message: "Email sent successfully",
            messageId: info.messageId
        });

    } catch (error) {
        console.error("Email Error:", error.message);

        res.status(500).json({
            message: "Email sending failed"
        });
    }
};

module.exports = { sendEmail };
