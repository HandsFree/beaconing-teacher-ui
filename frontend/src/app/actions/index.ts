import { ActionsType } from 'hyperapp';

const actions: ActionsType<Counter.IState, Counter.IActions> = {
    down: () => ({ count }) => ({ count: count - 1 }),
    reset: () => ({ count: 0 }),
    up: () => ({ count }) => ({ count: count + 1 }),
};

export default actions;
