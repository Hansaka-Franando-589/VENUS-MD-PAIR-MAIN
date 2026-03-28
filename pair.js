const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const logger = pino({ level: 'info' });
const {
    makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    DisconnectReason,
} = require('@whiskeysockets/baileys');
const axios = require('axios');

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

function generateRandomText() {
    const prefix = "3EB";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomText = prefix;
    for (let i = prefix.length; i < 22; i++) {
        randomText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomText;
}

const grandCaption = `
👑 𝙌𝙐𝙀𝙀𝙉 𝙑𝙀𝙉𝙐𝙎 𝙈𝘿 👑
━━━━━━━✧━━━━━━━

🔥 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝒕𝒉𝒆 𝑹𝒐𝒚𝒂𝒍 𝑫𝒐𝒎𝒊𝒏𝒊𝒐𝒏 🔥

You have successfully connected to the most advanced, elegant, and powerful WhatsApp User Bot. 
Engineered with state-of-the-art architecture for supreme performance.

🌟 *DEVELOPER:* Hansaka P. Fernando
📞 *CONTACT:* +94779912589
🚀 *VERSION:* V1 - Premium Edition

🔒 *SECURITY WARNING:* 
  "𝙳𝙾 𝙽𝙾𝚃 𝚂𝙷𝙰𝚁𝙴 𝚃𝙷𝙸𝚂 𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙸𝙳 𝚆𝙸𝚃𝙷 𝙰𝙽𝚈𝙾𝙽𝙴!"
Your session ID is the master key to your WhatsApp. Keep it completely safe and private.

🛠️ *HOW TO DEPLOY YOUR QUEEN:*
┌───────────────────
│ 1️⃣ Fork the Queen Venus repository.
│ 2️⃣ Open the \`session.js\` file.
│ 3️⃣ Paste your Session ID carefully:
│   \`SESSION_ID: '<YOUR_SESSION_ID>'\`
│ 4️⃣ Deploy and conquer your world! ✅
└───────────────────

✨ *Let the Royal Supremacy Begin!* ✨
━━━━━━━✧━━━━━━━
`;

async function GIFTED_MD_PAIR_CODE(id, num, res) {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'temp', id));
    const { version, isLatest } = await fetchLatestBaileysVersion();
    try {
        const sock = makeWASocket({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: pino({ level: 'silent' }),
            syncFullHistory: false,
            browser: Browsers.ubuntu('Chrome'),
            markOnlineOnConnect: false,
        });

        if (!sock.authState.creds.registered) {
            await delay(5000);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) {
                res.send({ code });
            }
        }

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                await delay(5000);
                // ✅ JID normalize කිරීම — :device suffix ඉවත් කිරීම
                const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const credsFilePath = path.join(__dirname, 'temp', id, 'creds.json');
                
                try {
                    // Update Bio
                    try {
                        await sock.updateProfileStatus("👑 𝓠𝓮𝓮𝓷 𝓥𝓮𝓷𝓾𝓼 𝓜𝓓 𝓥1.0.3 𝓞𝓯𝓯𝓲𝓬𝓲𝓪𝓵 𝓷𝓾𝓶𝓫𝓮𝓻");
                    } catch (e) {
                        logger.error('Bio update failed');
                    }
                
                    // Update DP
                    const imgUrl = "https://i.ibb.co/0V2BdtpJ/Whats-App-Image-2026-03-28-at-12-07-53-AM.jpg";
                    try {
                        const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                        const imgBuffer = Buffer.from(response.data, 'binary');
                        await sock.updateProfilePicture(myJid, imgBuffer);
                    } catch (e) {
                        logger.error('DP update failed');
                    }

                    const credsData = fs.readFileSync(credsFilePath, 'utf-8');
                    const base64Session = Buffer.from(credsData).toString('base64');
                    const md = "QUEEN VENUS =" + base64Session;
                    const codeMessage = await sock.sendMessage(myJid, { text: md });
                    
                    await sock.sendMessage(myJid, {
                        image: { url: imgUrl },
                        caption: grandCaption,
                        contextInfo: {
                            isForwarded: true,
                            forwardingScore: 999,
                            forwardedNewsletterMessageInfo: {
                                newsletterName: "Hansaka P. Fernando ☑️",
                                newsletterJid: "120363222395675670@newsletter",
                            },
                            externalAdReply: {
                                title: "Hansaka P. Fernando ☑️",
                                body: "Queen Venus MD Premium",
                                thumbnailUrl: imgUrl,
                                sourceUrl: "https://wa.me/94779912589",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: codeMessage });

                    let confirmMsg = `
✅ *Royal Setup Complete!*
➔ 🖼️ Profile Picture successfully updated to Queen Venus theme!
➔ 📝 WhatsApp About status seamlessly updated!
➔ 🚀 You are ready to rule.
`;
                    await sock.sendMessage(myJid, { text: confirmMsg }, { quoted: codeMessage });

                    await sock.ws.close();
                    removeFile(path.join(__dirname, 'temp', id));
                    logger.info(`👤 ${sock.user.id} ✅ 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲. 𝗦𝗲𝗿𝘃𝗲𝗿 𝘀𝘁𝗮𝘆𝗶𝗻𝗴 𝗮𝗹𝗶𝘃𝗲...`);
                } catch (error) {
                    logger.error(`Error in connection update: ${error.message}`);
                    const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    const errorMessage = await sock.sendMessage(myJid, { text: error.message });
                    const imgUrl = "https://i.ibb.co/0V2BdtpJ/Whats-App-Image-2026-03-28-at-12-07-53-AM.jpg";
                    
                    await sock.sendMessage(myJid, {
                        image: { url: imgUrl },
                        caption: grandCaption,
                        contextInfo: {
                            isForwarded: true,
                            forwardingScore: 999,
                            forwardedNewsletterMessageInfo: {
                                newsletterName: "Hansaka P. Fernando ☑️",
                                newsletterJid: "120363222395675670@newsletter",
                            },
                            externalAdReply: {
                                title: "Hansaka P. Fernando ☑️",
                                body: "Queen Venus MD Premium",
                                thumbnailUrl: imgUrl,
                                sourceUrl: "https://wa.me/94779912589",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: errorMessage });
                }
            } else if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                logger.warn(`Connection closed. Status code: ${statusCode}`);
                if (statusCode !== 401 && statusCode !== 403) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE(id, num, res);
                } else {
                    logger.error('Session invalid (401/403). Removing session files.');
                    removeFile(path.join(__dirname, 'temp', id));
                }
            }
        });
    } catch (error) {
        logger.error(`Error in VENUS_ND_PAIR_CODE: ${error.message}`);
        removeFile(path.join(__dirname, 'temp', id));
        if (!res.headersSent) {
            res.send({ code: "❗ Service Unavailable" });
        }
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    const num = req.query.number;
    if (!num) {
        return res.status(400).send({ error: 'Number is required' });
    }
    await GIFTED_MD_PAIR_CODE(id, num, res);
});

// ⏰ Memory cleanup every 24 hours (no restart needed on Railway)
setInterval(() => {
    logger.info('☘️ 𝟐𝟒𝗵 𝗰𝗵𝗲𝗰𝗸𝗽𝗼𝗶𝗻𝘁 - 𝗦𝗲𝗿𝘃𝗲𝗿 𝘀𝘁𝗶𝗹𝗹 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 ✅');
}, 86400000);

module.exports = router;
