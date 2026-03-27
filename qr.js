const { makeid } = require('./gen-id');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    fetchLatestBaileysVersion,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");
const axios = require('axios');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
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

router.get('/', async (req, res) => {
    const id = makeid();
    
    async function GIFTED_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
            const { version } = await fetchLatestBaileysVersion();
            
            let sock = makeWASocket({
                version,
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS('Desktop'),
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
            });
            
            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect,
                    qr
                } = s;
                if (qr) await res.end(await QRCode.toBuffer(qr));
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    
                    const randomText = generateRandomText();
                    
                    // Update Bio
                    try {
                        await sock.updateProfileStatus("👑 𝙌𝙐𝙀𝙀𝙉 𝙑𝙀𝙉𝙐𝙎 𝙈𝘿 👑 | Supreme Engine by Hansaka P. Fernando: +94779912589");
                    } catch (e) {
                        console.log('Bio update failed');
                    }
                
                    // Update DP
                    const imgUrl = "https://i.ibb.co/0V2BdtpJ/Whats-App-Image-2026-03-28-at-12-07-53-AM.jpg";
                    try {
                        const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                        const imgBuffer = Buffer.from(response.data, 'binary');
                        await sock.updateProfilePicture(sock.user.id, imgBuffer);
                    } catch (e) {
                        console.log('DP update failed');
                    }

                    try {
                        const base64Session = Buffer.from(data.toString()).toString('base64');
                        let md = "QUEEN VENUS =" + base64Session;
                        let code = await sock.sendMessage(sock.user.id, { text: md });
                        
                        await sock.sendMessage(sock.user.id, {
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
                        }, { quoted: code });

                        let confirmMsg = `
✅ *Royal Setup Complete!*
➔ 🖼️ Profile Picture successfully updated to Queen Venus theme!
➔ 📝 WhatsApp About status seamlessly updated!
➔ 🚀 You are ready to rule.
`;
                        await sock.sendMessage(sock.user.id, { text: confirmMsg }, { quoted: code });
                    } catch (e) {
                        let ddd = await sock.sendMessage(sock.user.id, { text: e.toString() });
                        await sock.sendMessage(sock.user.id, {
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
                        }, { quoted: ddd });
                    }
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close") {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    console.log(`Connection closed. Status code: ${statusCode}`);
                    if (statusCode !== 401 && statusCode !== 403) {
                        await delay(10000);
                        GIFTED_MD_PAIR_CODE();
                    } else {
                        console.log('Session invalid (401/403). Removing session files.');
                        removeFile('./temp/' + id);
                    }
                }
            });
        } catch (err) {
            console.log("service restarted", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    await GIFTED_MD_PAIR_CODE();
});

// ⏰ පැය 24කට වරක් Restart (86,400,000ms)
setInterval(() => {
    console.log("☘️ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...");
    process.exit();
}, 86400000);

module.exports = router;
