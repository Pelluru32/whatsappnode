const { Client, LocalAuth } = require('whatsapp-web.js');
//const qrcode = require('qrcode-terminal');
const qrcode = require('qrcode');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT=process.env.PORT||4500


const app = express();
app.use(cors()); // To allow requests from your React frontend
app.use(express.json()); // To parse JSON bodies

let client;
let qrCodeGenerated = false;

app.get("/",(req,res)=>{
  res.send("hello from nodejs backend")
})

app.get('/apiwa/generate-qr', async (req, res) => {
    try {
      if (!qrCodeGenerated) {
        client = new Client({
          authStrategy: new LocalAuth({
            dataPath: 'datawhatsapp'
          }),
        });
  
        let qrCodeUrl;
  
        // Handle QR code generation
        const qrHandler = async (qr) => {
          try {
            qrCodeUrl = await qrcode.toDataURL(qr);
            if (!res.headersSent) {
              res.json({ qrCode: qrCodeUrl });
            }
            client.removeListener('qr', qrHandler);
          } catch (err) {
            console.error('Error generating QR code:', err);
            if (!res.headersSent) {
              res.status(500).json({ status: 'error', message: 'Failed to generate QR code' });
            }
          }
        };
  
        client.on('qr', qrHandler);
  
        client.on('ready', () => {
            qrCodeGenerated = true;
            return res.json({ status: 'ready for chat' });
          });
  
        // Handle authentication failure
        client.on('auth_failure', (msg) => {
          console.log('Authentication failure:', msg);
          qrCodeGenerated = false;
          if (!res.headersSent) {
           return res.status(400).json({ status: 'auth_failure', message: msg });
          }
  
          // Remove the 'qr' event listener on authentication failure
          client.removeListener('qr', qrHandler);
        });
  
     
        // Initialize the client
        await client.initialize();
  
      } else {
       return res.status(500).json({ status: 'already_initialized' });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      if (!res.headersSent) {
        return res.status(500).json({ status: 'error', error: error.message });
      }
    }
});

console.log(client);

// app.get('/generate-qr', async (req, res) => {
//     try {
//       if (!qrCodeGenerated) {
//         client = new Client({
//           authStrategy: new LocalAuth({
//             dataPath: 'datawhatsapp'
//           }),
//         });
  
//         let qrCodeUrl;
//         let timeoutId;
  
//         // Handle QR code generation
//         client.on('qr', async (qr) => {
//           try {
//             qrCodeUrl = await qrcode.toDataURL(qr);
//             console.log('QR Code generated:', qrCodeUrl); // Log the QR code for debugging
//          console.log(res.headersSent);
  
//             // Send QR code to client if not already sent
//             if (!res.headersSent) {
//               res.json({ qrCode: qrCodeUrl });
//             }
//           } catch (err) {
//             console.error('Error generating QR code:', err);
//             if (!res.headersSent) {
//               res.status(500).json({ status: 'error', message: 'Failed to generate QR code' });
//             }
//           }
//         });
  
//         // Handle client ready event
//         client.on('ready', () => {
//           console.log('Client is ready!');
//           qrCodeGenerated = true;
//           // Send a response only if the QR code was not sent
//           if (!res.headersSent) {
//             res.json({ status: 'ready' });
//           }
//         });
  
//         // Handle authentication failure
//         client.on('auth_failure', (msg) => {
//           console.log('Authentication failure:', msg);
//           qrCodeGenerated = false;
//           if (!res.headersSent) {
//             res.status(400).json({ status: 'auth_failure', message: msg });
//           }
//         });
  
//         // Set a timeout to handle cases where the QR code is not scanned
//         timeoutId = setTimeout(() => {
//           if (!res.headersSent) {
//             res.status(408).json({ status: 'timeout', message: 'QR code not scanned in time' });
//           }
//         }, 30000); // 30 seconds timeout
  
//         // Initialize the client
//         await client.initialize();
  
//         // Clear timeout if the response is sent
//         client.on('ready', () => {
//           clearTimeout(timeoutId);
//         });
  
//       } else {
//         res.status(500).json({ status: 'already_initialized' });
//       }
//     } catch (error) {
//       console.error('Error generating QR code:', error);
//       if (!res.headersSent) {
//         res.status(500).json({ status: 'error', error: error.message });
//       }
//     }
//   });
// Endpoint to start the WhatsApp client and generate the QR code
// app.get('/generate-qr', async (req, res) => {
//     try {
//       if (!qrCodeGenerated) {
//         client = new Client({
//           authStrategy: new LocalAuth({
//             dataPath: 'datawhatsapp'
//           }),
//         });
  
//         // Handle QR code generation
//         client.on('qr', async (qr) => {
//           try {
//             const url = await qrcode.toDataURL(qr);
//             res.json({ qrCode: url });
//           } catch (err) {
//             console.error('Error generating QR code:', err);
//             res.status(500).json({ status: 'error', message: 'Failed to generate QR code' });
//           }
//         });
  
//         // Handle client ready event
//         client.on('ready', () => {
//           console.log('Client is ready!');
//           qrCodeGenerated = true;
//           // Send a response only if the QR code was not sent
//           if (!res.headersSent) {
//             res.json({ status: 'ready' });
//           }
//         });
  
//         // Handle authentication failure
//         client.on('auth_failure', (msg) => {
//           console.log('Authentication failure:', msg);
//           qrCodeGenerated = false;
//           if (!res.headersSent) {
//            return res.status(400).json({ status: 'auth_failure', message: msg });
//           }
//         });
  
//         // Initialize the client
//         await client.initialize();
//       } else {
//         return  res.status(500).json({ status: 'already_initialized' });
//       }
//     } catch (error) {
//       console.error('Error generating QR code:', error);
//       return res.status(500).json({ status: 'error', error: error.message });
//     }
//   });

// Endpoint to send messages to a group of people

app.post('/apiwa/send-messages', async (req, res) => {
  try {
    const { message } = req.body;

    const phoneNumbers = [
      '916281689526',
      '919550405989',
      '918897339489',
      '919505599969',
    ];
  
   
    if (client) {
      const sendMessageToAll =await phoneNumbers.map(async(number) => {
        const chatId = `${number}@c.us`;
        return await client.sendMessage(chatId, message);
      });

      const results = await Promise.all(sendMessageToAll);
      res.json({ status: 'messages_sent', results });

    } else {
      res.status(400).json({ status: 'client_not_ready' });
    }
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Endpoint to send a single message
app.post('/apiwa/send-message', async (req, res) => {
  try {
    const { number, message } = req.body;

    if (client) {
      const chatId = `${number}@c.us`;
      const response = await client.sendMessage(chatId, message);
      res.json({ status: 'message_sent', response });
    } else {
      res.status(400).json({ status: 'client_not_ready' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Endpoint to logout and delete session data
app.post('/apiwa/logout', async (req, res) => {
    try {
      const sessionDir = path.join(__dirname, 'datawhatsapp');
      if (fs.existsSync(sessionDir)) {
        await fs.promises.rm(sessionDir, { recursive: true, force: true });
      }
      qrCodeGenerated = false;
      client = null;
      console.log('Logged out and session data deleted.');
      res.json({ status: 'logged_out' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ status: 'error', error: error.message });
    }
  });
  

app.listen(PORT, () => {
  console.log('Server running on port 3001');
});
