import React, { Component } from "react";
import GlobalLoading from "../components/GlobalLoading";
import QuestionWrapper from "../components/QuestionWrapper";
import Title from "../components/Title";
import { motion } from "framer-motion";
import { Button, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import ContextWrapper from "../context/ContextWrapper";
import { withTranslation } from "react-i18next";
const variants = {
    open: { opacity: 1, y: 0 },
    closed: {
        y: 100
    },
    transitionEnd: { display: "none" }
};
let questionsRefs = [];

class MainQuesions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: parseInt(this.props.stage) || 0,
            showBottom: false,
            answers:
                this.props.tempData !== null
                    ? JSON.parse(this.props.tempData.data)
                    : this.props.questions.map(el => {
                          var o = Object.assign({});
                          o.level = 0;
                          o.unique_group = el.unique_group;
                          o.group = el.group;
                          o.show_error = false;
                          return o;
                      }),
            yOffset: 0
        };

        this.handleSetLevel = this.handleSetLevel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAutoSave = this.handleAutoSave.bind(this);
        this.buttonRef = React.createRef();
        this.scrollListener = this.scrollListener.bind(this);
        window.setAllLevel = this.setAllLevel.bind(this);
    }

    setAllLevel() {
        let answerCopy = [...this.state.answers];
        for (let index = 0; index < answerCopy.length; index++) {
            answerCopy[index].level = Math.floor(Math.random() * 6) + 1 + "";
        }
        this.setState(
            {
                answers: answerCopy
            },
            () => console.log("Level is set!")
        );
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showBottom: true
            });
        }, 1000);

        setTimeout(() => {
            this.setState({
                showBottom: false
            });
        }, 5000);

        window.addEventListener("scroll", this.scrollListener);

        const ele = document.getElementById("ipl-progress-indicator");
        if (ele) {
            // fade out
            ele.classList.add("available");
        }
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollListener);
    }
    scrollListener(event) {
        this.setState({
            yOffset: window.pageYOffset
        });
    }
    handleSetLevel(unique_group, level) {
        this.handleAutoSave();
        this.setState(state => {
            const answers = state.answers.map(answer => {
                if (answer.unique_group == unique_group) {
                    const copy = Object.assign({}, answer);
                    copy.level = level;
                    copy.show_error = false;
                    return copy;
                }
                return answer;
            });
            return {
                answers
            };
        });
    }

    handleAutoSave() {
        window.axios.put(window.baseURL + "/api/temp", {
            data: this.state.answers,
            user_id: this.props.auth.user.id
        });
    }

    async handleSubmit() {
        const { answers } = this.state;

        for (let index = 0; index < answers.length; index++) {
            const element = answers[index];
            if (element.level == 0) {
                window.scroll({
                    top: questionsRefs[index],
                    behavior: "smooth"
                });
                let answerCopy = [...answers];
                answerCopy[index].show_error = true;
                this.setState({
                    answers: answerCopy
                });
                break;
            }
        }
        if (!answers.some(e => e.level == 0)) {
            const ele = document.getElementById("ipl-progress-indicator");
            if (ele) {
                // fade out
                ele.classList.remove("available");
            }
            try {
                const rs = await window.axios.post(
                    window.baseURL + "/api/submit",
                    {
                        results: this.state.answers,
                        user_id: this.props.auth.user.id
                    }
                );
                ele.classList.add("available");
                this.props.onFinished();
            } catch (error) {
                this.props.notify.error("Cannot save at this time!");
            } finally {
            }
        }
    }
    render() {
        const { showBottom, answers, yOffset } = this.state;
        const { questions, levels_positive, levels_negative } = this.props;
        return (
            <div className="bg-gray-100">
                <div className="pb-16 container h-full sm:w-176">
                    <div className="w-full h-full items-center">
                        {questions.map((question, index) => (
                            <QuestionWrapper
                                key={question.id}
                                addRef={ref => {
                                    questionsRefs.push(ref);
                                }}
                                error={answers[index].show_error}
                            >
                                <Title number={index + 1}>
                                    {question.question}
                                </Title>
                                <Answer
                                    levels={
                                        question.type == 1
                                            ? levels_positive
                                            : levels_negative
                                    }
                                    value={
                                        answers.find(
                                            e =>
                                                e.unique_group ==
                                                question.unique_group
                                        ).level
                                    }
                                    index={index}
                                    onClick={level =>
                                        this.handleSetLevel(
                                            question.unique_group,
                                            level
                                        )
                                    }
                                />
                            </QuestionWrapper>
                        ))}
                    </div>
                    <hr className="mb-6" />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        {this.props.t("submit")}
                    </Button>

                    <div className="fixed bottom-0 right-0 left-0 flex justify-center mb-6">
                        <motion.div
                            variants={variants}
                            initial={{ opacity: 0, y: 50 }}
                            animate={showBottom ? "open" : "closed"}
                            className="px-3 py-1 rounded-lg border-2 border-green-600 bg-white"
                        >
                            <div className="text-green-600 font-semibold">
                                {this.props.t("auto_save")}
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="fixed" style={{ bottom: 15, right: 15 }}>
                    <div className="flex flex-col gap-3">
                        <button
                            disabled={yOffset < 200}
                            className={
                                (yOffset < 200 ? "opacity-75" : "") +
                                " bg-teal-600 p-2 rounded shadow"
                            }
                            onClick={() => {
                                window.scroll({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }}
                        >
                            <img
                                src={
                                    window.baseURL +
                                    "/public/images/arrow-down.svg"
                                }
                                className="w-5 transform rotate-180"
                            />
                        </button>
                        <button
                            disabled={
                                document.body.scrollHeight - yOffset < 1000
                            }
                            className={
                                (document.body.scrollHeight - yOffset < 1000
                                    ? "opacity-75"
                                    : "") + " bg-teal-600 p-2 rounded shadow"
                            }
                            onClick={() => {
                                window.scroll({
                                    top: document.body.scrollHeight,
                                    behavior: "smooth"
                                });
                            }}
                        >
                            <img
                                src={
                                    window.baseURL +
                                    "/public/images/arrow-down.svg"
                                }
                                className="w-5"
                            />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextWrapper(withTranslation()(MainQuesions));

const Answer = React.memo(
    ({ levels, value, index, onClick }) => {
        return (
            <>
                <div>
                    <RadioGroup
                        aria-label="level"
                        name={"level" + index}
                        value={value}
                        onChange={event => onClick(event.target.value)}
                    >
                        {levels.map(level => (
                            <FormControlLabel
                                key={level.id}
                                value={level.group + ""}
                                control={<Radio color="primary" />}
                                label={level.level}
                            />
                        ))}
                    </RadioGroup>
                </div>
            </>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.value == nextProps.value;
    }
);
