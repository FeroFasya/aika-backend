const { chatWithAika } = require('./aika');

async function test() {
    console.log('lagi ngehubungi aika...')
    

    // Pesan pertamamu untuknya
    const pesan = "Halo Aika! cium aku";
    
    // Menunggu balasan dari API
    const jawaban = await chatWithAika(pesan);

    // balasan dari aika
    console.log('\n=== Balasan dari Aika ===');
    console.log(jawaban);
    console.log('=========================\n');
}

test();