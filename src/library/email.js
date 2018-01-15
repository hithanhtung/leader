module.exports = (app) => {

    // Validate email
    app.validateEmail = (x) => {
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        return (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length);
    };

    const nodemailer = require('nodemailer');
    app.sendMail = (mailTo, mailSubject, mailText, mailHtml, mailAttachments, done) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: app.mailFrom,
                pass: app.mailPassword
            }
        });
        var mailOptions = {
            from: app.mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailText,
            html: mailHtml,
            attachments: mailAttachments
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                if (done) done(error);
            } else {
                console.log('Send mail to ' + mailTo + ' successful.');
                if (done) done(null);
            }
        });
    };
};