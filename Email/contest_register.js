const dotenv = require('dotenv')
dotenv.config({path:'./Config/sendinblue.env'})
const SibApiV3Sdk = require('sib-api-v3-sdk');


function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
  
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  
    return date.toLocaleString("en-US", options);
  }


function contest_register( fullname, recipient,title,type,start_date,end_date,contest_link) {

    const con_startDate = formatDateTime(start_date);
const con_endDate = formatDateTime(end_date);
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
        {
            'replyTo': { 'email': 'support@learnbits.in', 'name': 'Learnbits Support' },
            'to': [{ 'name': fullname, 'email': recipient }],
            'templateId':2,
            'params': { 'fullname':fullname,'title':title,'type':type,'start_date':con_startDate, 'end_date':con_endDate,'contest_link':contest_link}
        }
    ).then(function(data) {
        // console.log(data);
        return;
    }, function(error) {
        // console.error(error);
        return;
    });

    // console.log('email sent')
}

module.exports =  contest_register ;


