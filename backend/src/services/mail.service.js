const mail = require('nodemailer')

const transporter = mail.createTransport({
    service: "gmail",
    auth: {
        user: "akashwaradeofficial@gmail.com",
        pass: "maijfidozjgrubel"
    }
})

const sendMail = async (to, subject, html) => {
    let options = {
        to, subject, html
    }
    return await transporter.sendMail(options)
}

module.exports = sendMail