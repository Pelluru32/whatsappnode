const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: 'datawhatsapp'
    }),
  });
  
  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });
  
  client.on('ready', () => {
    console.log('Client is ready!');
  
    const phoneNumbers = [
      '916281689526',
      '919550405989',
      '918897339489',
      '919505599969',
    ];
  
    const message = 'Hello, this is a message sent to a WhatsApp number! from wwejs  to check message, By Gowtham';
  
    phoneNumbers.forEach((number) => {
      const chatId = `${number}@c.us`; // Correctly format the WhatsApp ID
  
      client.sendMessage(chatId, message)
        .then(response => {
          console.log(`Message sent to ${chatId}:`, response);
        })
        .catch(err => {
          console.error(`Failed to send message to ${chatId}:`, err);
        });
    });
  });
  
  client.on('auth_failure', (msg) => {
    console.log('Authentication failure:', msg);
  });
  
  client.initialize();
  
  