const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
var _ = require('lodash');

const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: `${process.env.VONAGE_API_KEY}`,
  apiSecret: `${process.env.VONAGE_API_SECRET}`,
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log();
exports.slackWebhook = async (req, res) => {
  switch (req.body.sender) {
    case 'Josh':
      var sender = 'joshua.butler@learningsource.com';
      var emailSignature =
        'Joshua Butler <span style="color:#27ABE3">|</span> Senior Mentor';
      var emailContact = `<span style="color:#27ABE3">T:</span> 512.770.9459 <span style="color:#27ABE3">E:</span> ${sender}`;
      break;
    case 'Kyle':
      var sender = 'kyle.wheeless@learningsource.com';
      var emailSignature =
        'Kyle Wheeless <span style="color:#27ABE3">|</span> Senior Mentor';
      var emailContact = `<span style="color:#27ABE3">T:</span> 512.438.1910 <span style="color:#27ABE3">E:</span> ${sender}`;
      break;
    default:
      var sender = 'kyle.wheeless@learningsource.com';
  }
  let studentEmails = req.body.email.split(' ');
  let studentNumbers = req.body.numbers.split(' ');
  let messageSignature = req.body.signature;
  if (messageSignature) {
    messageSignature = ' - ' + req.body.signature + ', at Learning Source';
  } else {
    messageSignature = ' - Learning Source Education';
  }
  switch (req.body.message) {
    case 'LDA':
      subject = 'Attendance - Reminder';
      switch (req.body.daysLDA) {
        case '3':
        case '4':
        case '5':
        case '6':
          message = `Hello there! We are reaching out regarding your attendance. Currently you are not meeting the attendance policy and are ${req.body.daysLDA} days out of attendance. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!`;
          break;
        case '7':
        case '8':
        case '9':
          message = `Hello there! We are reaching out regarding your attendance. Currently you are not meeting the attendance policy and are ${req.body.daysLDA} days out of attendance and run the risk of being removed from the program after ten days. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!`;
          break;
        case '10':
          message =
            'Hello there! We are reaching out regarding your attendance. Currently you are not meeting the attendance policy and are ten days out of attendance, today is your last day to access your course before being removed from the program. To remedy this please take time to log into your course and begin progressing. To help ensure success, spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
        default:
          message =
            'Hello there! We are reaching out regarding your attendance. Currently, you are not meeting the attendance policy. To remedy this please take time to log into your course and begin progressing. To help ensure success spending a minimum of 20 hours a week in class will help you be successful in completing your course on time, with a good understanding, and with a passing grade. If you have any questions, please let our education team know. Thanks, you got this!';
          break;
      }
      break;
    case 'Behind':
      subject = 'Late Coursework - Reminder';
      message =
        'Hello there! We are reaching out regarding your coursework. We noticed you are a bit behind in your course and we are concerned as the further you fall behind, the harder it will become to get caught back up. Please make sure to be communicating with us and to be progressing in your coursework DAILY. If you are needing help please utilize your mentor, program channel and workshops found here: https://vimeo.com/thewozu/albums | if you cannot find a workshop that works for you please let a mentor know asap so we can find one that will work for your needs. Please remember, no late finals will be accepted past the Sunday night deadline unless prior arrangements have been made and approved by your Instructor/Senior Mentor, or other extenuating circumstances apply. Thanks, you got this!';
      break;
    case 'LDABehind':
      subject = 'Late Coursework and Attendance - Reminder';
      message =
        'Hello there! We are reaching out regarding your coursework. We noticed you are a bit behind in your course and not making attendance, we are concerned as the further you fall behind, the harder it will become to get caught back up. Please make sure to be communicating with us and to be progressing in your coursework DAILY. If you are needing help please utilize your mentor, program channel and workshops found here: https://vimeo.com/thewozu/albums | if you cannot find a workshop that works for you please let a mentor know asap so we can find one that will work for your needs. Please remember, no late finals will be accepted past the Sunday night deadline unless prior arrangements have been made and approved by your Instructor/Senior Mentor, or other extenuating circumstances apply. Make sure to be spending at least 20 hours a week in your course to make attendance, if you need help setting up a coursework schedule please let your mentor know. Thanks, you got this!';
    case 'CommunicationIssues':
      subject = 'Communication - Reminder';
      message =
        'Hello there! I hope all is well. We are reaching out regarding your communication. Communication is the key to success. We would like to touch base and see how we can be of better support to help you reach your goal. Is there a good time for us to chat?';
      break;
    case 'NoComms':
      subject = 'We are concerned!';
      message =
        'Hello there! We are concerned about you and your success in your current course. We have not heard from you recently and would like to ensure you are okay. Please respond at your earliest convenience. We would like to see how you are and help to set a game plan to place you back on track in your course. We are here to support you and to see you reach your goals. Hope to hear from you soon! ';
      break;
    default:
      message = req.body.message;
      break;
  }
  switch (req.body.team) {
    case 'SWD':
      teamName = 'Software Development';
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'DSO':
      teamName = 'Data Science';
      notifyBody =
        'nolan.hardeman@learningsource.com margaret.martinez@learningsource.com milton.gerardino@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'CSO':
      teamName = 'Cyber Security';
      notifyBody =
        'shaun.manzano@learningsource.com kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'MDO':
      teamName = 'Mobile Development';
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'CSO&SWD':
      teamName = 'Cyber Security & Software Development';
      notifyBody =
        'shaun.manzano@learningsource.com kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'UAT':
      teamName = 'UAT';
      notifyBody =
        'kyle.wheeless@learningsource.com joshua.butler@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    case 'ALL':
      teamName = 'All';
      notifyBody =
        'shaun.manzano@learningsource.com kyle.wheeless@learningsource.com joshua.butler@learningsource.com ashley.kyler@learningsource.com brittney.stuart@learningsource.com nolan.hardeman@learningsource.com margaret.martinez@learningsource.com milton.gerardino@learningsource.com' +
        ' ' +
        req.body.notify;
      break;
    default:
      notifyBody = 'kyle.wheeless@learningsource.com' + ' ' + req.body.notify;
      break;
  }
  let messageCombine = message + messageSignature;
  let notify = notifyBody.split(' ');

  if (req.body.team) {
    teamMessage = `Hello ${teamName} management member(s)! `;
  } else {
    teamMessage = '';
  }
  let messageNotify = `${teamMessage}The following students ${studentEmails.join(
    ', '
  )} have received the message "${messageCombine}" from the Communication Bot.`;
  const msg = {
    to: 'kyle.wheeless@scitexas.edu', // Change to your recipient
    from: sender, // Change to your verified sender
    subject: req.body.subject || subject,
    cc: notify,
    bcc: studentEmails,
    html: `<p>${message}</p><br><p><img src="http://cdn.mcauto-images-production.sendgrid.net/fed3c6639160b248/e9edef5a-e3b2-4130-a2a4-5159fe6d9f85/165x32.png"> <br> <img src="http://cdn.mcauto-images-production.sendgrid.net/fed3c6639160b248/f66363cb-cbe8-4c41-aca4-ccf3cf90a173/272x11.png"> <br> ${emailSignature}<br>1701 Directors Blvd <span style="color:#27ABE3">|</span>  Suite 800 <span style="color:#27ABE3">|</span>  Austin, TX 78744<br>${emailContact}</p>`,
  };
  try {
    main().then(() => {
      console.log('Complete!');
    });

    async function main() {
      await sendMail(msg).then(() => {
        console.log('Emails sent!');
      });
      await emailLoop(studentEmails, messageCombine).then(() => {
        console.log('Slacked Students!');
      });
      await notifyStaff(notify, messageNotify).then(() => {
        console.log('Notified Staff!');
      });
      if (req.body.sendTrue === 'true') {
        await sendText(studentNumbers, messageCombine).then(() => {
          console.log('Texted Students!');
        });
      }
      await res.status(200).json('Shizzle was sent to studentizzles!');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

const sendMail = async (msg) => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

let webhookArray = [
  `${process.env.SLACK_WEBHOOK_URL}`,
  `${process.env.SLACK_WEBHOOK_URL2}`,
  `${process.env.SLACK_WEBHOOK_URL3}`,
];
const uri = _.sample(webhookArray);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
let emailLoop = async (studentEmails, messageCombine) => {
  try {
    for (let i = 0; i < studentEmails.length; i++) {
      await sleep(1000);
      await fetch(uri, {
        method: 'POST',
        body: JSON.stringify({
          email: studentEmails[i],
          message: messageCombine,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.body);
    }
    return res.status(500).json('Server Error');
  }
};

const notifyStaff = async (notify, messageNotify) => {
  try {
    for (let i = 0; i < notify.length; i++) {
      await sleep(1000);
      await fetch(uri, {
        method: 'POST',
        body: JSON.stringify({
          email: notify[i],
          message: messageNotify,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.body);
    }
    return res.status(500).json('Server Error');
  }
};

const sendText = async (studentNumbers, messageCombine) => {
  try {
    for (let i = 0; i < studentNumbers.length; i++) {
      await sleep(1000);
      const studentNumber = studentNumbers[i];
      const from = `18335642712`;
      const to = studentNumber;
      const text = messageCombine;

      vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          if (responseData.messages[0]['status'] === '0') {
            console.log('Message sent successfully.');
          } else {
            console.log(
              `Message failed with error: ${responseData.messages[0]['error-text']}`
            );
          }
        }
      });
    }
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.body);
    }
    return res.status(500).json('Server Error');
  }
};
