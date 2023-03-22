// http://localhost/?code=4/0AWtgzh4M0lwOPFXmZClYkd2VS_J-eW-UHmyd7egGBRwhR6cu1H83gkmxRlAgjlmToVfXEw&
// scope=https://www.googleapis.com/auth/gmail.send
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('./credentials.json');
const code = '4/0AWtgzh4M0lwOPFXmZClYkd2VS_J-eW-UHmyd7egGBRwhR6cu1H83gkmxRlAgjlmToVfXEw';
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(__dirname, 'token.json');
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});