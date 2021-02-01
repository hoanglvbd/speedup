import { motion } from "framer-motion";
import React, { Component } from "react";
import GlobalLoading from "../components/GlobalLoading";
import ContextWrapper from "../context/ContextWrapper";
import Precaution from "../pageComponents/Precaution";
import ShowNumberOfTime from "../pageComponents/ShowNumberOfTime";
import MainQuestions from "../pageComponents/MainQuestions";
import ShowFinish from "../pageComponents/ShowFinish";

const variants = {
    open: { opacity: 1, scale: 1, display: "block" },
    closed: {
        opacity: 0,
        scale: 0.95,
        transitionEnd: {
            display: "none"
        }
    }
};
const variantsHasTemp = {
    open: { opacity: 1, y: 0, display: "flex" }
};
const STAGES = {
    SHOW_WELCOME: "SHOW_WELCOME",
    /*   LOAD_PRECAUTION: "LOAD_PRECAUTION", */
    LOAD_QUESTION: "LOAD_QUESTION",
    SHOW_QUESTION: "SHOW_QUESTION",
    FINISH: "FINISH"
};

class UserTestSpeedUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: STAGES.SHOW_WELCOME,
            remainTime: 2,
            showTemp: false,
            tempData: null,
            showLanguage: false,

            levels_positive: [],
            levels_negative: [],
            questions: [],
            questionStage: {},
            questionCurrent: {}
        };
        this.handleContinue = this.handleContinue.bind(this);
        this.createAutoSave = this.createAutoSave.bind(this);
        this.loadQuestions = this.loadQuestions.bind(this);
        this.getTemp = this.getTemp.bind(this);
        this.fetchNumberOfTime = this.fetchNumberOfTime.bind(this);
    }

    componentDidMount() {
        this.getTemp();
        this.fetchNumberOfTime();
    }
    async fetchNumberOfTime() {
        const rs = await window.axios.get(
            window.baseURL + "/api/get_number_of_time",
            {
                params: {
                    user_id: this.props.auth.user.id
                }
            }
        );
        this.setState({
            remainTime: rs.data.total
        });
    }
    async getTemp() {
        const rs = await window.axios.get(window.baseURL + "/api/temp", {
            params: {
                user_id: this.props.auth.user.id
            }
        });
        if (rs.data.temp !== null) {
            if (rs.data.temp.data !== null) {
                this.setState({
                    showTemp: true,
                    tempData: rs.data.temp
                });
            }
        }
    }
    handleContinue() {
        this.props.loader.setLoader(true);
        this.loadQuestions();
    }
    createAutoSave() {
        window.axios.post(window.baseURL + "/api/temp", {
            user_id: this.props.auth.user.id
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.lang.lang !== this.props.lang.lang) {
            if (this.state.stage == STAGES.SHOW_QUESTION) {
                let ele = document.getElementById("ipl-progress-indicator");
                ele.classList.remove("available");

                this.loadQuestions().then(() => {
                    ele.classList.add("available");
                });
            }
        }
    }
    async loadQuestions() {
        return new Promise((resolve, reject) => {
            window.axios
                .get(window.baseURL + "/api/getQuestions", {
                    params: {
                        lang: this.props.lang.lang,
                        category: 1
                    }
                })
                .then(rs => {
                    this.setState(
                        {
                            questions: rs.data.questions,
                            levels_positive: rs.data.levels_positive,
                            levels_negative: rs.data.levels_negative,
                            questionStage: null,
                            questionCurrent: null
                        },
                        () => {
                            this.setState(
                                {
                                    stage: STAGES.SHOW_QUESTION
                                },
                                () => {
                                    resolve();
                                }
                            );
                        }
                    );
                });
        });
    }
    render() {
        const {
            stage,
            remainTime,
            showTemp,
            tempData,
            showLanguage,
            questions,
            questionCurrent,
            questionStage,
            levels_negative,
            levels_positive
        } = this.state;

        const { lang, setLang } = this.props.lang;
        return (
            <>
                {stage === STAGES.SHOW_WELCOME && (
                    <>
                        <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-center  flex-col">
                            <ShowNumberOfTime
                                remainTime={remainTime}
                                showTemp={showTemp}
                                tempData={tempData}
                                onContinue={this.handleContinue}
                                onClick={() => {
                                    this.createAutoSave();
                                    let ele = document.getElementById(
                                        "ipl-progress-indicator"
                                    );
                                    ele.classList.remove("available");
                                    this.loadQuestions();
                                }}
                            />
                        </div>
                        <motion.div
                            variants={variantsHasTemp}
                            initial={{ opacity: 0, y: 30 }}
                            animate={showTemp ? "open" : ""}
                            className="mb-20 hidden justify-center fixed bottom-0 left-0 right-0 "
                        >
                            <div className="px-20 py-4 rounded-lg text-center border-2 bg-white z-50 shadow">
                                <div className="font-semibold text-lg">
                                    Welcome back
                                </div>
                                <div>
                                    <span>Pick up where you left off.</span>
                                    <span className="text-gray-700 italic">
                                        Today
                                    </span>
                                </div>
                                <button
                                    onClick={this.handleContinue}
                                    className="mt-6 focus:opacity-50 bg-white focus:outline-none focus:shadow-lg border-2 border-blue-700 text-blue-700 text-center font-semibold px-2 py-1 rounded"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
                {/*   {stage === STAGES.LOAD_PRECAUTION && (
                    <Precaution
                        onClick={() => {
                            this.createAutoSave();
                            this.loadQuestions();
                            this.setState({
                                tempData: null
                            });
                        }}
                    />
                )} */}
                {/* {stage === STAGES.LOAD_QUESTION && (
                    <GlobalLoading title="Preparing questions" />
                )} */}

                {stage === STAGES.SHOW_QUESTION && (
                    <MainQuestions
                        questionCurrent={questionCurrent}
                        questions={questions}
                        tempData={tempData}
                        stage={questionStage}
                        levels_positive={levels_positive}
                        levels_negative={levels_negative}
                        lang={lang}
                        onFinished={() =>
                            this.setState({ stage: STAGES.FINISH })
                        }
                    />
                )}
                {stage === STAGES.FINISH && (
                    <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-center">
                        <ShowFinish remainTime={remainTime} />
                    </div>
                )}
                <div className="fixed" style={{ bottom: 15, left: 15 }}>
                    <div className="relative">
                        <span className="inline-block w-full rounded shadow border">
                            <button
                                onClick={() =>
                                    this.setState({
                                        showLanguage: !showLanguage
                                    })
                                }
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded="true"
                                aria-labelledby="listbox-label"
                                className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-1 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={
                                                window.baseURL +
                                                (lang == 1
                                                    ? "/public/images/vi-flag.svg"
                                                    : lang == 2
                                                    ? "/public/images/ja-flag.svg"
                                                    : "/public/images/en-flag.svg")
                                            }
                                            className="w-6"
                                        />
                                        <span className="font-semibold block whitespace-no-wrap">
                                            {lang == 1
                                                ? "Tiếng Việt"
                                                : lang == 2
                                                ? "日本語"
                                                : "English"}
                                        </span>
                                    </div>
                                </div>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                {/*  */}
                            </button>
                            <motion.div
                                animate={showLanguage ? "open" : "closed"}
                                variants={variants}
                                initial={{
                                    display: "none"
                                }}
                                transition={{
                                    duration: 0.1
                                }}
                                className="absolute mt-1 w-full rounded border bg-white shadow-lg z-10"
                                style={{ bottom: 35 }}
                            >
                                <ul
                                    tabIndex="-1"
                                    role="listbox"
                                    aria-labelledby="listbox-label"
                                    aria-activedescendant="listbox-item-3"
                                    className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                                >
                                    <li
                                        onClick={() => {
                                            this.setState({
                                                showLanguage: false
                                            });
                                            setLang(1);
                                        }}
                                        role="option"
                                        className={
                                            (lang == 1
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900") +
                                            " cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={
                                                    window.baseURL +
                                                    "/public/images/vi-flag.svg"
                                                }
                                                className="w-6"
                                            />
                                            <span className="font-semibold block whitespace-no-wrap">
                                                Tiếng Việt
                                            </span>
                                        </div>
                                    </li>
                                    <li
                                        onClick={() => {
                                            this.setState({
                                                showLanguage: false
                                            });
                                            setLang(2);
                                        }}
                                        role="option"
                                        className={
                                            (lang == 2
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900") +
                                            " cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={
                                                    window.baseURL +
                                                    "/public/images/ja-flag.svg"
                                                }
                                                className="w-6"
                                            />
                                            <span className="font-semibold block whitespace-no-wrap">
                                                日本語
                                            </span>
                                        </div>
                                    </li>
                                    <li
                                        onClick={() => {
                                            this.setState({
                                                showLanguage: false
                                            });
                                            setLang(3);
                                        }}
                                        role="option"
                                        className={
                                            (lang == 3
                                                ? "bg-indigo-600 text-white"
                                                : " text-gray-900 ") +
                                            " cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={
                                                    window.baseURL +
                                                    "/public/images/en-flag.svg"
                                                }
                                                className="w-6"
                                            />
                                            <span className="font-semibold block whitespace-no-wrap">
                                                English
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>
                        </span>
                    </div>
                </div>
            </>
        );
    }
}

export default ContextWrapper(UserTestSpeedUp);
