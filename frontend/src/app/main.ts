import { View } from 'hyperapp';
import { div } from '@hyperapp/html';

const beaconingWrapper = () => {
    return div();
};

const mainView: View<Beaconing.IState, Beaconing.IActions> = (state, actions) =>  {
    return div({ id: 'app' }, [
        beaconingWrapper(),
    ]);
};

export default mainView;
