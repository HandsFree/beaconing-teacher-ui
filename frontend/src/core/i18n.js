// @flow
import i18nConfig from '../config/i18n.config.json5';
import nullishCheck from './util';
import APICore from './api';

class I18n {
    language = 'en-GB';

    langFetched = false;

    api = new APICore();

    currUser = null;

    async fetchLang() {
        if (this.currUser === null) {
            this.currUser = this.api.getCurrentUser();
            const user = await this.currUser;

            const lang = nullishCheck(await user?.language, 'en-GB');
            this.language = lang;
            this.langFetched = true;
            return;
        }

        // stop data races
        await this.currUser;
    }

    async getPhrase(key: string) {
        if (!this.langFetched) {
            await this.fetchLang();
        }

        const keys = Object.keys(i18nConfig);
        let langs = [];

        if (keys.indexOf(key) === -1) {
            console.log(`[I18n] Translation not found for key: ${key}`);
            return '';
        }

        langs = i18nConfig[key];

        const langsKeys = Object.keys(langs);

        if (langsKeys.indexOf(this.language) !== -1) {
            return langs[this.language]?.length > 0 ? langs[this.language] : langs['en-GB'];
        }

        return langs['en-GB'];
    }
}

export default I18n;
