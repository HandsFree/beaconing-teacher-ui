// @flow

// scss
import '../scss';

// Beaconing
import APICore from './api';

const apiCore = new APICore();
const accessabar = new window.Accessabar();

window.beaconingAPI = apiCore;
window.abarRuntime = accessabar; // temporary
