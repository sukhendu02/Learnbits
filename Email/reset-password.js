const dotenv = require('dotenv')
dotenv.config({path:'./Config/sendinblue.env'})
dotenv.config({path:'./config.env'})

// const sendinblue = require('sendinblue-api');
// // console.log(process.env.SENDINBLUE_API_KEY)
// const client = new sendinblue(process.env.);

// async function reset_pass(fullname,recipient , link) {
//     const data = {
//         // to: recipient,
//         to : [{'name': fullname, 'email':recipient}],
//         from: ['sender@example.com', 'Sender Name'],
//         // subject: subject,
//         templateId: 1,
//         // html: content
//     };

//     try {
//         const response = await client.send_email(data);
//         console.log('Email sent successfully:', response);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }

const SibApiV3Sdk = require('sib-api-v3-sdk');

function reset_pass( fullname, recipient,link) {
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
        {
            // 'subject': 'Hello from the Node SDK!',
            // 'sender': { 'email': 'api@sendinblue.com', 'name': 'Sendinblue' },
            'replyTo': { 'email': 'support@learnbits.in', 'name': 'Learnbits Support' },
            'to': [{ 'name': fullname, 'email': recipient }],
            // 'htmlContent': '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
            'templateId':1,
            'params': { 'link': link,'fullname':fullname, }
        }
    ).then(function(data) {
        // console.log(data);
        return;
    }, function(error) {
        // console.error(error);
        // return error
    });
}

module.exports =  reset_pass ;


