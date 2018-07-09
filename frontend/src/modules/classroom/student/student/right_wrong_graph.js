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
                questions: [],
            });
        }

        const makeAnswer = (question, answer, succ) => {
            const bgClass = succ ? '.rw-correct' : '.rw-incorrect';
            return div(
                '.rw-box' + bgClass,
                p('.rw-question', question),
                div('.rw-box-answer',
                    p(answer),
                    p(succ ? 'Correct' : 'Incorrect'),
                ),
            );
        }

        // convert flat array into a nice dictionary
        // of question/answer data.
        for (const answer of data.answers) {
            const ansObj = answerSet.get(answer.rootAnalyticsName);
            ansObj.questions.push({
                title: 'Question ' + answer.target,
                answer: 'Answer ' + answer.response,
                failed: !answer.success,
            });
            
            // do we have to replace the object again in js?
            answerSet.set(answer.rootAnalyticsName, ansObj);
        }

        const answerListEl = [];
        for (const [name, entry] of answerSet.entries()) {
            const questionSet = [];
            for (const question of entry.questions) {
                questionSet.push(makeAnswer(question.title, question.answer, !question.failed));
            }

            answerListEl.push(div('.rw-question-container',
                h2(name),
                div('.rw-question-set', questionSet),
            ));
        }

        return div(answerListEl);
    }
}

export default RightWrongGraph;
