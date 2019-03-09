// @flow
import { div, h1, h2, h3, p } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

class QuestionBox extends Component {
    state = {
        showQuestions: false,
    }

    async toggleQuestions() {
        this.state.showQuestions = !this.state.showQuestions;        
        this.updateView(await this.render());
    }

    async render() {
        const { minigameName, questionSet } = this.props;
        const { showQuestions } = this.state;

        return div('.rw-question-container',
            h3(
                '.fake-link', 
                minigameName, 
                {
                    onclick: () => {
                        this.toggleQuestions();
                    },
                    title: 'Click to toggle question set visibility',
                }
            ),
            div('.rw-question-set', showQuestions ? questionSet : []),
        );
    }
}

// misnomer... this isn't really a graph oh well
class RightWrongGraph extends Component {
    async render() {
        const { data } = this.props;
        if (nullishCheck(data.answers, 'none') === 'none') {
            return div(h2(await window.beaconingAPI.getPhrase('err_no_data')));
        }

        const answerSet = new Map();
        for (const answer of data.answers) {
            answerSet.set(answer.rootAnalyticsName, {
                name: answer.rootAnalyticsName,
                minigames: new Map(),
            });
        }

        const correctTransl = await window.beaconingAPI.getPhrase('rw_correct');
        const incorrectTransl = await window.beaconingAPI.getPhrase('rw_incorrect');

        const makeAnswer = (question, answer, succ) => {
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

        const answerListProm = [];
        for (const [glpName, entry] of answerSet.entries()) {
            answerListProm.push(h2(glpName));

            for (const [mgName, mg] of entry.minigames.entries()) {

                const questionSet = [];
                for (const question of mg.questions) {
                    questionSet.push(makeAnswer(question.title, question.answer, !question.failed));
                }

                answerListProm.push(new QuestionBox().attach({
                    minigameName: mgName,
                    questionSet,
                }));
            }
        }

        const answerListEl = await Promise.all(answerListProm).then((el => el));
        return div('.answer-list-box', answerListEl);
    }
}

export default RightWrongGraph;
