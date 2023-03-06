import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6

export default {
    input: 'src/sodium', // Path relative to package.json
    output: {
        name: 'libsodium', // CHANGE THIS
        exports: 'named',
    },
    plugins: [
        commonjs()
    ],
};