import i18nConfig from '../config/i18n.config.json5';

class I18n {
    language = 'en-GB';
    langFetched = false;

    async fetchLang() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        const lang = currUser?.language ?? 'en-GB';
        this.language = lang;
        this.langFetched = true;
    }

    async getPhrase(key: string) {
        if (!this.langFetched) {
            await this.fetchLang();
        }

        const keys = Object.keys(i18nConfig);
        let langs = [];

        if (keys.indexOf(key) !== -1) {
            langs = i18nConfig[key];
        }

        const langsKeys = Object.keys(langs);

        if (langsKeys.indexOf(this.language) !== -1) {
            return langs[this.language]?.length > 0 ? langs[this.language] : langs['en-GB'];
        }

        return langs['en-GB'];
    }
}

export default I18n;
