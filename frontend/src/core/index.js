// @flow

// Rollbar - only use when needed
// import Rollbar from 'rollbar';
// import rollbarConfig from '../config/rollbar.config.json';

// scss
import '../scss';

// Beaconing
import BeaconingCore from './beaconing';

// const rollbar = new Rollbar(rollbarConfig);
const beaconing = new BeaconingCore();
const accessabar = new window.Accessabar();

window.beaconingCore = beaconing;
window.abarRuntime = accessabar; // temporary
