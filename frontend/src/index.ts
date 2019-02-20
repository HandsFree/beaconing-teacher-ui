import * as OfflinePluginRuntime from 'offline-plugin/runtime';

// import css
import './css';

// import app
import './app';

// service worker
OfflinePluginRuntime.install();

// accept HMR
if (module && module.hot) {
    module.hot.accept();
}
