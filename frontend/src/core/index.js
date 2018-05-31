// @flow

// scss
import '../scss';

// Beaconing
import APICore from './api';
import I18n from './i18n';

const apiCore = new APICore();
const i18n = new I18n();
const accessabar = new window.Accessabar();

window.beaconingAPI = apiCore;
window.bcnI18n = i18n;
window.abarRuntime = accessabar; // temporary
