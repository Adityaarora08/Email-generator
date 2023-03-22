const fs = require('fs');
const path = require('path');
const sendMail = require('./gmail');

//TO SEND MAIL FROM HERE, REFER TO INDEX2.JS
const main = async () => {
  const fileAttachments = [
    {
      filename: 'attachment1.txt',
      content: 'Contatc me if it is really really really urgent on 9891888897',
    },
    {
      path: path.join(__dirname, './attachment2.txt'),
    },

    {
      filename: 'image.png',
      content: fs.createReadStream(path.join(__dirname, './attach.png')),
    },
  ];
  const options = {
    to: 'adityaarora3540@gmail.com',
    cc: 'tomarprince443@gmail.com',
    replyTo: 'tomarprince443@gmail.com',
    subject: 'Vacation Mode is ONNNN',
    text: 'This email is sent from the command line',
    html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from Aditya Arora</a>.</p>`,
    attachments: fileAttachments,
    textEncoding: 'base64',
    headers: [
      { key: 'X-Application-Developer', value: 'Aditya Arora' },
    //   { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
  };

  const messageId = await sendMail(options);
  return messageId;
};

main()
  .then((messageId) => console.log('Message sent successfully:', messageId))
  .catch((err) => console.error(err));