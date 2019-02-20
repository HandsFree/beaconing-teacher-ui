const config = {
    files: [
        'tests/ava/**/*.ts',
    ],
    sources: [
        'src/**/*.ts',
    ],
    extensions: ['ts'],
    compileEnhancements: false,
    cache: true,
    require: ['ts-node/register'],
};

export default config;
