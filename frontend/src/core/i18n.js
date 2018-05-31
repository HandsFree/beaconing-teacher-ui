import i18nConfig from '../config/i18n.config.json5';

class I18n {
    language = 'en-GB';

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        const lang = currUser?.language ?? 'en-GB';
        this.language = lang;
    }

    getPhrase(key: string) {
        const keys = Object.keys(l18nConfig);
        let langs = [];

        if (keys.indexOf(key) !== -1) {
            langs = l18nConfig[key];
        }

        const langsKeys = Object.keys(langs);

        if (langsKeys.indexOf(this.language) !== -1) {
            return langs[this.language];
        }

        return langs['en-GB'];
    }
}

export default I18n;