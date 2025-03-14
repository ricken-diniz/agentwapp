const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const client = new Client();



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
    fetch('http://127.0.0.1:8000/chat/'+msg.body)
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            msg.reply(data.message); // Exibe o valor da chave 'message'
        })
        .catch(error => console.log('Erro:', error));
});

client.initialize();