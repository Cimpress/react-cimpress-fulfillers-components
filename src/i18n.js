import i18n from 'i18next';

let languages = require('./locales/translations.json');
const en = require('./locales/en-US/react-fulfillers');
const de = require('./locales/de-DE/react-fulfillers');
const fr = require('./locales/fr-FR/react-fulfillers');
const it = require('./locales/it-IT/react-fulfillers');
const nl = require('./locales/nl-NL/react-fulfillers');
const ja = require('./locales/ja-JP/react-fulfillers/');

let i18n_instance = null;

function getI18nInstance() {

    if ( !i18n_instance ) {
        i18n_instance = i18n.createInstance();

        i18n_instance
            .init({

                fallbackLng: 'en',

                resources: {
                    en: { translations: en },
                    de: { translations: de },
                    fr: { translations: fr },
                    it: { translations: it },
                    nl: { translations: nl },
                    ja: { translations: ja },
                },

                ns: ['translations'],
                defaultNS: 'translations',

                debug: false,

                interpolation: {
                    escapeValue: false, // not needed for react!!
                },

                react: {
                    wait: true
                }
            });
    }

    return i18n_instance;
}

export {
    getI18nInstance
};
