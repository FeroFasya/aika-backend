async function testPintuGerbang() {
    console.log("Mengirim pesan ke server Aika...");

    try {
        // Mengirim paket (POST) ke alamat server kita
        const respon = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Aika, kamu bisa mendengarku lewat pintu gerbang server?" })
        });

        // Membuka paket balasan dari server
        const data = await respon.json();
        
        console.log("\n=== BALASAN DARI SERVER ===");
        console.log(data);
        console.log("===========================\n");
    } catch (error) {
        console.error("Gagal menghubungi server:", error);
    }
}

testPintuGerbang();