import { View } from 'hyperapp';
import { div } from '@hyperapp/html';
import beaconingHeader from './components/header.component';

const mainView: View<Beaconing.IState, Beaconing.IActions> = (state, actions) =>  {
    return div({ id: 'app' }, [
        beaconingHeader(),
    ]);
};

export default mainView;
