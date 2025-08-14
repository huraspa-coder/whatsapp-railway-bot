const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Variable de entorno para guardar la sesión
let sessionData;
if (process.env.SESSION_DATA) {
    try {
        sessionData = JSON.parse(process.env.SESSION_DATA);
    } catch (err) {
        console.error("❌ Error al parsear SESSION_DATA:", err);
    }
}

const client = new Client({
    session: sessionData,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', qr => {
    console.log('📲 Escanea este QR para conectar tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log('🔑 Autenticado. Guardando sesión...');
    // Guardamos la sesión en formato string para ponerla en Railway
    console.log("-----COPIA ESTO EN SESSION_DATA EN RAILWAY-----");
    console.log(JSON.stringify(session));
    console.log("------------------------------------------------");
});

client.on('ready', () => {
    console.log('✅ Bot de WhatsApp listo y conectado.');
});

client.on('message', async msg => {
    console.log(`📩 Mensaje de ${msg.from}: ${msg.body}`);

    if (msg.body.toLowerCase() === 'hola') {
        await client.sendMessage(msg.from, '¡Hola Gonzalo! Estoy corriendo en Railway 🚂');
    }
});

client.initialize();
