const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer');
const config = require('./config.json');

const oauth2Client = new OAuth2(
  config.clientId,
  config.clientSecret,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: config.refresh_token
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.user,
    clientId: config.clientId,
    clientSecret: config.client_secret,
    refreshToken: config.refresh_token,
    accessToken: oauth2Client.getAccessToken()
  }
});

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

let lastMessageTime = Date.now();

setInterval(() => {
  gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 1
  }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      const messages = res.data.messages;
      if (messages && messages.length) {
        const message = messages[0];
        const messageTime = parseInt(message.internalDate);
        if (messageTime > lastMessageTime) {
          lastMessageTime = messageTime;
          gmail.users.messages.get({
            userId: 'me',
            id: message.id
          }, (err, res) => {
            if (err) {
              console.error(err);
            } else {
              const email = res.data.payload.headers.find(header => header.name === 'From').value;
              const name = email.split(' ')[0];
              const message = {
                from: `"${config.name}" <${config.user}>`,
                to: email,
                subject: 'Automatic reply: On vacation',
                text: `Hi ${name},\n\nThanks for your email. I'm currently on vacation and won't be able to respond until I return on ${config.returnDate}.\n\nBest regards,\n${config.name}`
              };
              transporter.sendMail(message, (err, info) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`Auto-reply sent to ${email}: ${info.response}`);
                }
              });
            }
          });
        }
      }
    }
  });
}, Math.floor(Math.random() * 75000) + 45000);