// @flow

// Rollbar - only use when needed
// import Rollbar from 'rollbar';
// import rollbarConfig from '../config/rollbar.config.json5';

// scss
import '../scss';

// Beaconing
import APICore from './api';

// const rb = new Rollbar(rollbarConfig);
const apiCore = new APICore();
const accessabar = new window.Accessabar();

window.beaconingAPI = apiCore;
window.abarRuntime = accessabar; // temporary
// window.rollbar = rb;
