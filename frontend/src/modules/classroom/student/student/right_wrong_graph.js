// @flow
import { div, h1, h2, h3, p } from '../../../../core/html';
import { Component } from '../../../../core/component';

class RightWrongGraph extends Component {
    async render() {
        const { data } = this.props;

        const answerSet = new Map();
        for (const answer of data.answers) {
            answerSet.set(answer.rootAnalyticsName, {
                name: answer.rootAnalyticsName,
                minigames: new Map(),
            });
        }

        const makeAnswer = (question, answer, succ) => {
            const correctTransl = await window.bcnI18n.getPhrase('rw_correct');
            const incorrectTransl = await window.bcnI18n.getPhrase('rw_incorrect');

            const bgClass = succ ? '.rw-correct' : '.rw-incorrect';
            return div(
                '.rw-box' + bgClass,
                p('.rw-question', question),
                div('.rw-box-answer',
                    p(answer),
                    p(succ ? correctTransl : incorrectTransl),
                ),
            );
        }

        // convert flat array into a nice dictionary
        // of question/answer data.
        for (const answer of data.answers) {
            const {
                analyticsName,
                response,
                rootAnalyticsName,
                success,
                target,
                timestamp,
            } = answer;

            const ansObj = answerSet.get(rootAnalyticsName);

            ansObj.minigames.set(analyticsName, {
                name: analyticsName,
                questions: [],
            });
            
            // do we have to replace the object again in js?
            answerSet.set(rootAnalyticsName, ansObj);
        }

        // populate: todo this can be done in one for loop
        // but for lazyness and readability sake it's going
        // into two!
        for (const answer of data.answers){
            const {
                analyticsName,
                response,
                rootAnalyticsName,
                success,
                target,
                timestamp,
            } = answer;

            const ansObj = answerSet.get(rootAnalyticsName);
            const minigames = ansObj.minigames.get(analyticsName);
            minigames.questions.push({
                title: target,
                answer: response,
                failed: !success,
            });

            // do we have to replace the object again in js?
            answerSet.set(rootAnalyticsName, ansObj);
        }

        const answerListEl = [];
        for (const [glpName, entry] of answerSet.entries()) {
            answerListEl.push(div(h2(glpName)));

            for (const [mgName, mg] of entry.minigames.entries()) {

                const questionSet = [];
                for (const question of mg.questions) {
                    questionSet.push(makeAnswer(question.title, question.answer, !question.failed));
                }

                answerListEl.push(div('.rw-question-container',
                    h3(mgName),
                    div('.rw-question-set', questionSet),
                ));

            }

        }

        return div(answerListEl);
    }
}

export default RightWrongGraph;
