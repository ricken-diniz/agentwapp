import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';
// Time Controller
import { TimeController } from './timecontroller.js';
const tc = new TimeController

// Configuration
const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.toFile('qrcode.png', qr, { width: 300 }, (err) => {
    if (err) {
      console.error('Error generating QR code:', err);
    } else {
      console.log('QR code saved as qrcode.png');
    }
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});




// Messages Controller
client.on('message', msg => {


  data = {
    id: msg.id._serialized, // id for this message
    from: msg.from, // the sender id
    to: msg.to, // the recipient id
    timestamp: msg.timestamp, // the time for the message
    body: msg.body, // the content
    hasMedia: msg.hasMedia, // a boolen if there media
    isForwarded: msg.isForwarded, // a boolen that means if the message is forwarded
    isStarred: msg.isStarred, // if there a star in message
    fromMe: msg.fromMe, // boolen for to differentiate me and the bot
    type: msg.type, // the media type (text, video, image...)
    chat: msg.chat, // an object about the local where the message originated
    author: msg.author, // the author, its relevant for groups
    deviceType: msg.deviceType, // the device type (web, ios...)
    mentionedIds: msg.mentionedIds, // the list of mentions 
  };

  console.log('xxx')
  if (/^\d{10,15}@c\.us$/.test(data['from'])) {
    tc.newData(data) // ..... fix this, need review the logic of async methods in this case
      
  } // this fetch is to better in the timecontroller.js file
});



client.initialize();