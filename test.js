const sodium = require('./dist/libsodium.umd');

(async () => {

    let key = await sodium.generateKey();
    const data = {
        fingerprint: 'fingerprint',
        callback_url: '/api/callback'
    };
    let dataString = JSON.stringify(data);

    let encrypted = await sodium.encrypt(dataString, key)
    let decrypted = await sodium.decrypt(encrypted, key)
    if (decrypted === dataString) {
        console.log('Test passed')
        return;
    }
    console.log('Test error')
})();
