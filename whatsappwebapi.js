const { Client } = require('whatsapp-web.js');
  const qrcode = require('qrcode');

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
  url = 'http://127.0.0.1:8000/chat'
  if (/^\d{10,15}@c\.us$/.test(data['from'])) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        msg.reply(data.message); // Exibe o valor da chave 'message'
      })
      .catch(error => console.log('Erro:', error));
  }
});

client.initialize();