import { div, button, h1 } from '@hyperapp/html';

const counter = ({ count }, { up, down, reset }) => {
    return div({ class: 'counter-grid' }, [
        h1({ class: 'counter-header' }, count),
        div({ class: 'button-container' }, [
            button(
                {
                    class: 'button',
                    onclick: () => {
                        down();
                    },
                },
                '-',
            ),
            button(
                {
                    class: 'button',
                    onclick: () => {
                        reset();
                    },
                },
                '\u27F2', // ⟲
            ),
            button(
                {
                    class: 'button',
                    onclick: () => {
                        up();
                    },
                },
                '+',
            ),
        ]),
    ]);
};

export default counter;
export { counter };
