(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('libsodium-wrappers')) :
    typeof define === 'function' && define.amd ? define(['exports', 'libsodium-wrappers'], factory) :
    (global = global || self, factory(global.libsodium = {}, global.libsodiumWrappers));
}(this, (function (exports, libsodiumWrappers) { 'use strict';

    libsodiumWrappers = libsodiumWrappers && Object.prototype.hasOwnProperty.call(libsodiumWrappers, 'default') ? libsodiumWrappers['default'] : libsodiumWrappers;

    var encrypt = async (message, key) => {
        return await _encrypt(message, key);
    };

    var decrypt = async (message, key) => {
        return _decrypt(message, key)
    };

    async function _encrypt(message, key) {
        await libsodiumWrappers.ready;
        const sodium = libsodiumWrappers;
        const nonceBytes = sodium.crypto_secretbox_NONCEBYTES;
        key = sodium.from_hex(key);
        let nonce = sodium.randombytes_buf(nonceBytes);
        let encrypted = sodium.crypto_secretbox_easy(message, nonce, key);
        let x = _typedArrayConcat(Uint8Array, nonce, encrypted);
        return _buf2hex(x)
    }

    async function _decrypt(encrypted, key) {
        await libsodiumWrappers.ready;
        const sodium = libsodiumWrappers;
        const nonceBytes = 24;
        const macBytes = sodium.crypto_secretbox_MACBYTES;
        key = sodium.from_hex(key);
        encrypted = Buffer.from(encrypted, 'hex');
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

    var sodium = {
    	encrypt: encrypt,
    	decrypt: decrypt
    };

    exports.decrypt = decrypt;
    exports.default = sodium;
    exports.encrypt = encrypt;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
