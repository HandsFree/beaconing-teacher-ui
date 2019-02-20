declare namespace Counter {
    interface IState {
        count: number;
    }

    interface IActions {
        down(): (state: Counter.IState) => Counter.IState;
        up(): (state: Counter.IState) => Counter.IState;
        reset(): Counter.IState;
    }
}

// Allow png files to be imported
declare module '*.png';
