const PostcssPresetEnv = require('postcss-preset-env');
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const PostcssNestedProps = require('postcss-nested-props');
const PostcssNestedAncestors = require('postcss-nested-ancestors');
const PostcssNested = require('postcss-nested');
const PostcssEasyImport = require('postcss-easy-import');
const PostcssSorting = require('postcss-sorting');
const PostcssCustomMedia = require('postcss-custom-media');
const RucksackCSS = require('rucksack-css');

const config = {
    plugins: [
        PostcssEasyImport({
            extensions: [
                '.css',
                '.pcss',
            ],
        }),
        PostcssNestedProps,
        PostcssNestedAncestors,
        PostcssNested,
        RucksackCSS,
        PostcssCustomMedia,
        PostcssFlexbugsFixes,
        PostcssPresetEnv({
            autoprefixer: {
                grid: true,
            },
        }),
        PostcssSorting({
            order: [
                'at-variables',
                'custom-properties',
                'declarations',
                'at-rules',
                'rules',
            ],
            'properties-order': 'alphabetical',
        }),
    ],
};

module.exports = config;
