import { View } from 'hyperapp';
import { div } from '@hyperapp/html';
import counter from './components/counter.component';

const mainView: View<Counter.IState, Counter.IActions> = (state, actions) => div({ id: 'app' }, [counter(state, actions)]);

export default mainView;
