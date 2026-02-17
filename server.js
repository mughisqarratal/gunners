const path = require('path');

// Mengarahkan Node ke file server hasil build standalone Next.js
// Secara default, Next.js meletakkan server di .next/standalone/server.js
const nextServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');

try {
    // Memanggil server bawaan Next.js
    require(nextServerPath);
} catch (error) {
    console.error("Gagal memuat Next.js Server. Pastikan folder .next/standalone sudah ada.");
    console.error("Error Detail:", error.message);
    
    // Fallback sederhana agar server tidak langsung mati tanpa info
    const http = require('http');
    http.createServer((req, res) => {
        res.writeHead(500);
        res.end("Server Build Not Found. Please Re-deploy.");
    }).listen(process.env.PORT || 3000);
}