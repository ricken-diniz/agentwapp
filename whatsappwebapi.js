import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { Client } from 'whatsapp-web.js';
const { LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const url = require('./config.json').python_api_url
const controller = createChatCollector();
import qrcode from 'qrcode';


// Configuration
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    timeout: 60000,
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
import { createChatCollector } from './timecontroller.js';
client.on('message', async (msg) => {

  let data = {
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

  // console.log(data);
  if (/^\d{10,15}@c\.us$/.test(data['from'])) {
    controller.addMessage(data);
    controller.promise.then(result => {

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result['chatMessages'])
      })
        .then(response => response.json())
        //   if(response.status !== 200) {
        //     console.error('Error:', response.statusText);
        //   }else{
        //     console.log('Status Code:', response.status);
        //     response.json()
        //   }
        // })
        .then(data => {
          console.log(data) // Exibe o valor da chave 'message'
          msg.reply(data.message); // Exibe o valor da chave 'message' 
        })
        .catch(error => console.log('Erro:', error));
    
      // end promise
    });
    //end if
  };

  // end client event
});

client.initialize();


