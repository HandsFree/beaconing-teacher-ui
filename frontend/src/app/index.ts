import { app } from 'hyperapp';

import state from './state';
import actions from './actions';
import view from './main';

// element to bind app to
const bindTo = document.body;

// render app
app(state, actions, view, bindTo);
