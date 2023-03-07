const _sodium = require('libsodium-wrappers');
const Buffer = require('buffer/').Buffer

module.exports.encrypt = async (message, key) => {
    return await _encrypt(message, key);
}

module.exports.decrypt = async (message, key) => {
    return await _decrypt(message, key)
}

module.exports.generateKey = () => {
    return _generateKey();
}

async function _generateKey() {
    await _sodium.ready;
    const key = _sodium.crypto_secretstream_xchacha20poly1305_keygen()
    return Buffer.from(key).toString('hex');
}

async function _encrypt(message, key) {
    await _sodium.ready;
    const sodium = _sodium;
    const nonceBytes = sodium.crypto_secretbox_NONCEBYTES;
    key = sodium.from_hex(key);
    let nonce = sodium.randombytes_buf(nonceBytes);
    let encrypted = sodium.crypto_secretbox_easy(message, nonce, key);
    let x = _typedArrayConcat(Uint8Array, nonce, encrypted);
    return _buf2hex(x)
}

async function _decrypt(encrypted, key) {
    await _sodium.ready;
    const sodium = _sodium;
    const utf8 = "utf-8";
    const nonceBytes = 24;
    const macBytes = sodium.crypto_secretbox_MACBYTES;
    key = sodium.from_hex(key)
    encrypted = Buffer.from(encrypted, 'hex')
    if (encrypted.length < nonceBytes + macBytes) {
        throw "Short message";
    }
    let nonce = encrypted.slice(0, nonceBytes);
    let ciphertext = encrypted.slice(nonceBytes);

    return (new TextDecoder()).decode(sodium.crypto_secretbox_open_easy(ciphertext, nonce, key));
}

function _buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

function _typedArrayConcat(ResultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new ResultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
