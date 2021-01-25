import { Formik } from "formik";
import React, { Component } from "react";
import Button from "../components/Button";
import ModalContainer from "../components/ModalContaner";
import SupperAdminLayout from "../pageComponents/SupperAdminLayout";
import * as Yup from "yup";
import Input from "../components/Input";
import ContextWrapper from "../context/ContextWrapper";

const editQuestionSchema = Yup.object({
    question_en: Yup.string().required("Can't leave it blank"),
    question_ja: Yup.string().required("Can't leave it blank"),
    question_vi: Yup.string().required("Can't leave it blank")
});
const schema = Yup.object({
    group_1: Yup.number()
        .min(0)
        .max(100),
    group_2: Yup.number()
        .min(0)
        .max(100),
    group_3: Yup.number()
        .min(0)
        .max(100),
    group_4: Yup.number()
        .min(0)
        .max(100),
    group_5: Yup.number()
        .min(0)
        .max(100),
    group_6: Yup.number()
        .min(0)
        .max(100),
    group_7: Yup.number()
        .min(0)
        .max(100),
    group_8: Yup.number()
        .min(0)
        .max(100),
    total: Yup.number()
        .min(0)
        .max(100)
});

class SupperAdminSpeedUpQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions_vi: [],
            questions_ja: [],
            questions_en: [],
            levels_positive_vi: [],
            levels_positive_ja: [],
            levels_positive_en: [],
            levels_negative_vi: [],
            levels_negative_ja: [],
            levels_negative_en: [],
            group_1: 0,
            group_2: 0,
            group_3: 0,
            group_4: 0,
            group_5: 0,
            group_6: 0,
            group_7: 0,
            group_8: 0,
            total: 0,
            modalEdit: false,
            modalEditAVG: false,
            currentQuestion: {},
            loading: false
        };
        this.getQuestions = this.getQuestions.bind(this);
        this.renderRowQuestions = this.renderRowQuestions.bind(this);
        this.renderLevelPositive = this.renderLevelPositive.bind(this);
        this.renderLevelNegative = this.renderLevelNegative.bind(this);
        this.renderVnAVG = this.renderVnAVG.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.handleSubmitAVG = this.handleSubmitAVG.bind(this);
    }
    componentDidMount() {
        this.getQuestions();
    }
    async getQuestions() {
        const rs = await window.axios.get(
            window.baseURL + "/admin/getQuestions"
        );
        this.setState({
            questions_vi: rs.data.questions_vi,
            questions_ja: rs.data.questions_ja,
            questions_en: rs.data.questions_en,
            levels_positive_vi: rs.data.levels_positive_vi,
            levels_positive_ja: rs.data.levels_positive_ja,
            levels_positive_en: rs.data.levels_positive_en,
            levels_negative_vi: rs.data.levels_negative_vi,
            levels_negative_ja: rs.data.levels_negative_ja,
            levels_negative_en: rs.data.levels_negative_en,

            group_1: parseInt(rs.data.group_1_vn_avg.value),
            group_2: parseInt(rs.data.group_2_vn_avg.value),
            group_3: parseInt(rs.data.group_3_vn_avg.value),
            group_4: parseInt(rs.data.group_4_vn_avg.value),
            group_5: parseInt(rs.data.group_5_vn_avg.value),
            group_6: parseInt(rs.data.group_6_vn_avg.value),
            group_7: parseInt(rs.data.group_7_vn_avg.value),
            group_8: parseInt(rs.data.group_8_vn_avg.value),
            total: parseInt(rs.data.total.value)
        });
    }
    renderRowQuestions() {
        const { questions_vi, questions_ja, questions_en } = this.state;

        return questions_vi.map((question, index) => (
            <tr
                key={question.id}
                className="hover:bg-gray-200 hover:cursor-default"
            >
                <td className="border px-6 py-4 w-20 text-center text-sm font-medium">
                    {question.unique_group}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {questions_vi[index].question}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {questions_ja[index].question}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {questions_en[index].question}
                </td>
                <td className="border px-6 py-4 whitespace-no-wrap text-center ">
                    <button
                        onClick={() => {
                            this.setState({
                                modalEdit: true,
                                currentQuestion: {
                                    type: "question",
                                    en: questions_en[index],
                                    ja: questions_ja[index],
                                    vi: questions_vi[index]
                                }
                            });
                        }}
                        className="text-indigo-600 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        ));
    }

    renderLevelPositive() {
        const {
            levels_positive_en,
            levels_positive_ja,
            levels_positive_vi
        } = this.state;

        return levels_positive_en.map((level, index) => (
            <tr
                key={level.id}
                className="hover:bg-gray-200 hover:cursor-default"
            >
                <td className="border px-6 py-4 w-20 text-center text-sm font-medium">
                    {level.group}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_positive_vi[index].level}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_positive_ja[index].level}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_positive_en[index].level}
                </td>
                <td className="border px-6 py-4 whitespace-no-wrap text-center ">
                    <button
                        onClick={() => {
                            this.setState({
                                modalEdit: true,
                                currentQuestion: {
                                    type: "level",
                                    en: levels_positive_en[index],
                                    ja: levels_positive_ja[index],
                                    vi: levels_positive_vi[index]
                                }
                            });
                        }}
                        className="text-indigo-600 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        ));
    }
    renderLevelNegative() {
        const {
            levels_negative_en,
            levels_negative_ja,
            levels_negative_vi
        } = this.state;

        return levels_negative_en.map((level, index) => (
            <tr
                key={level.id}
                className="hover:bg-gray-200 hover:cursor-default"
            >
                <td className="border px-6 py-4 w-20 text-center text-sm font-medium">
                    {level.group}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_negative_vi[index].level}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_negative_ja[index].level}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {levels_negative_en[index].level}
                </td>
                <td className="border px-6 py-4 whitespace-no-wrap text-center ">
                    <button
                        onClick={() => {
                            this.setState({
                                modalEdit: true,
                                currentQuestion: {
                                    type: "level",
                                    en: levels_negative_en[index],
                                    ja: levels_negative_ja[index],
                                    vi: levels_negative_vi[index]
                                }
                            });
                        }}
                        className="text-indigo-600 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        ));
    }
    renderVnAVG() {
        const {
            group_1,
            group_2,
            group_3,
            group_4,
            group_5,
            group_6,
            group_7,
            group_8,
            total
        } = this.state;

        return (
            <tr className="hover:bg-gray-200 hover:cursor-default">
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_1}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_2}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_3}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_4}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_5}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_6}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_7}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {group_8}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {total}
                </td>
                <td className="border px-6 py-4 whitespace-no-wrap text-center ">
                    <button
                        onClick={() => {
                            this.setState({
                                modalEditAVG: true
                            });
                        }}
                        className="text-indigo-600 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        );
    }

    handleSubmitEdit(values) {
        const { currentQuestion } = this.state;
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    await window.axios.put(
                        window.baseURL + "/admin/getQuestions",
                        {
                            type: currentQuestion.type,
                            is_positive:
                                currentQuestion.type == "level"
                                    ? currentQuestion.vi.type
                                    : 0,
                            unique_group: currentQuestion.en.unique_group,
                            question_en: values.question_en,
                            question_ja: values.question_ja,
                            question_vi: values.question_vi
                        }
                    );

                    if (currentQuestion.type == "question") {
                        let question_vi_copy = [...this.state.questions_vi];
                        let question_ja_copy = [...this.state.questions_ja];
                        let question_en_copy = [...this.state.questions_en];

                        const index = question_vi_copy.findIndex(
                            e =>
                                e.unique_group ==
                                currentQuestion.en.unique_group
                        );
                        question_vi_copy[index].question = values.question_vi;
                        question_ja_copy[index].question = values.question_ja;
                        question_en_copy[index].question = values.question_en;

                        this.setState({
                            questions_vi: question_vi_copy,
                            questions_ja: question_ja_copy,
                            questions_en: question_en_copy
                        });
                    } else {
                        if (currentQuestion.vi.type == 1) {
                            let levels_positive_en_copy = [
                                ...this.state.levels_positive_en
                            ];
                            let levels_positive_ja_copy = [
                                ...this.state.levels_positive_ja
                            ];
                            let levels_positive_vi_copy = [
                                ...this.state.levels_positive_vi
                            ];

                            const index = levels_positive_en_copy.findIndex(
                                e =>
                                    e.group == currentQuestion.en.group &&
                                    e.type == currentQuestion.en.type
                            );

                            levels_positive_en_copy[index].level =
                                values.question_en;
                            levels_positive_ja_copy[index].level =
                                values.question_ja;
                            levels_positive_vi_copy[index].level =
                                values.question_vi;

                            this.setState({
                                levels_positive_en: levels_positive_en_copy,
                                levels_positive_ja: levels_positive_ja_copy,
                                levels_positive_vi: levels_positive_vi_copy
                            });
                        } else {
                            let levels_negative_en_copy = [
                                ...this.state.levels_negative_en
                            ];
                            let levels_negative_ja_copy = [
                                ...this.state.levels_negative_ja
                            ];
                            let levels_negative_vi_copy = [
                                ...this.state.levels_negative_vi
                            ];

                            const index = levels_negative_en_copy.findIndex(
                                e =>
                                    e.group == currentQuestion.en.group &&
                                    e.type == currentQuestion.en.type
                            );

                            levels_negative_en_copy[index].level =
                                values.question_en;
                            levels_negative_ja_copy[index].level =
                                values.question_ja;
                            levels_negative_vi_copy[index].level =
                                values.question_vi;

                            this.setState({
                                levels_negative_en: levels_negative_en_copy,
                                levels_negative_ja: levels_negative_ja_copy,
                                levels_negative_vi: levels_negative_vi_copy
                            });
                        }
                    }
                    this.setState({
                        loading: false,
                        modalEdit: false
                    });
                    this.props.notify.success();
                } catch (error) {
                    this.props.notify.error();
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    handleSubmitAVG(values) {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.put(
                        window.baseURL + "/admin/getQuestions",
                        {
                            type: "setting",
                            group_1: values.group_1,
                            group_2: values.group_2,
                            group_3: values.group_3,
                            group_4: values.group_4,
                            group_5: values.group_5,
                            group_6: values.group_6,
                            group_7: values.group_7,
                            group_8: values.group_8,
                            total: values.total
                        }
                    );
                    this.setState({
                        loading: false,
                        modalEditAVG: false,
                        group_1: values.group_1,
                        group_2: values.group_2,
                        group_3: values.group_3,
                        group_4: values.group_4,
                        group_5: values.group_5,
                        group_6: values.group_6,
                        group_7: values.group_7,
                        group_8: values.group_8,
                        total: values.total
                    });
                    this.props.notify.success();
                } catch (error) {
                    this.props.notify.error();
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    render() {
        const {
            modalEdit,
            modalEditAVG,
            currentQuestion,
            loading
        } = this.state;
        return (
            <SupperAdminLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="flex justify-between items-center mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Questions & Calulation Management
                        </h1>
                    </div>
                    <div className="flex">
                        <a href="#questions">
                            <Button extraClass="mr-6">Questions</Button>
                        </a>

                        <a href="#level_positve">
                            <Button extraClass="mr-6">
                                Answer Positive Higher
                            </Button>
                        </a>
                        <a href="#level_negative">
                            <Button extraClass="mr-6">
                                Answer Negative Higher
                            </Button>
                        </a>
                        <a href="#vn_avg">
                            <Button extraClass="mr-6">
                                Setting Vietnamese Average
                            </Button>
                        </a>
                    </div>
                    {/*  */}
                    <h2
                        className="text-blue-600 font-bold leading-tight py-10 text-xl"
                        id="questions"
                    >
                        Speed Up Questions
                    </h2>
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/vi-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Vietnamese</span>
                                                </div>
                                            </th>

                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/ja-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Japan</span>
                                                </div>
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/en-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span>English</span>
                                                </div>
                                            </th>
                                            {/*  <th className="px-6 py-3 bg-gray-800 w-40 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                            Answer
                                        </th> */}
                                            <th className="px-6 py-3 bg-gray-800 w-40"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.renderRowQuestions()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <h2
                        className="text-blue-600 font-bold leading-tight py-10 text-xl"
                        id="level_positve"
                    >
                        Speed Up Answer Positive Higher
                    </h2>
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/vi-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Vietnamese</span>
                                                </div>
                                            </th>

                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/ja-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Japan</span>
                                                </div>
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/en-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span>English</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-800 w-40"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.renderLevelPositive()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <h2
                        className="text-blue-600 font-bold leading-tight py-10 text-xl"
                        id="level_negative"
                    >
                        Speed Up Answer Negative Higher
                    </h2>
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/vi-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Vietnamese</span>
                                                </div>
                                            </th>

                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/ja-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span> Japan</span>
                                                </div>
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <img
                                                        src={
                                                            window.baseURL +
                                                            "/public/images/en-flag.svg"
                                                        }
                                                        className="w-6 mr-3"
                                                    />
                                                    <span>English</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-800 w-40"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.renderLevelNegative()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <h2
                        className="text-blue-600 font-bold leading-tight py-10 text-xl"
                        id="vn_avg"
                    >
                        Vietnamese Average (%)
                    </h2>
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 1
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 2
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 3
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 4
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 5
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 6
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 7
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Group 8
                                            </th>
                                            <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 bg-gray-800 w-40"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {this.renderVnAVG()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 100 }}></div>
                </div>

                <div className="fixed" style={{ bottom: 15, right: 15 }}>
                    <div className="flex flex-col gap-3">
                        <button
                            className={"bg-teal-600 p-2 rounded shadow"}
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
                            className={" bg-teal-600 p-2 rounded shadow"}
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

                {modalEdit && (
                    <ModalContainer
                        onClick={() =>
                            this.setState({
                                modalEdit: false
                            })
                        }
                    >
                        <Formik
                            initialValues={{
                                question_en:
                                    currentQuestion.type == "question"
                                        ? currentQuestion.en.question
                                        : currentQuestion.en.level,
                                question_ja:
                                    currentQuestion.type == "question"
                                        ? currentQuestion.ja.question
                                        : currentQuestion.ja.level,
                                question_vi:
                                    currentQuestion.type == "question"
                                        ? currentQuestion.vi.question
                                        : currentQuestion.vi.level
                            }}
                            validationSchema={editQuestionSchema}
                            onSubmit={values => this.handleSubmitEdit(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-tl-lg rounded-tr-lg p-3 border-b-2 border-gray-300 bg-gray-200 rounded-">
                                        <h6 className="label text-xl">
                                            Edit{" "}
                                            {currentQuestion.type == "question"
                                                ? "Question"
                                                : "Answer"}
                                        </h6>
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title={` 
                                                <div class="flex items-center">
                                                    <svg class="w-6 mr-3" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" version="1.1">
                                                        <rect width="30" height="20" fill="#da251d"/>
                                                        <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#ff0"/>
                                                    </svg>
                                                    <span>Vietnamese</span>
                                                </div>
                                            `}
                                            required
                                            name="question_vi"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.question_vi}
                                            error={
                                                errors.question_vi &&
                                                touched.question_vi
                                            }
                                        />
                                        {errors.question_vi &&
                                            touched.question_vi && (
                                                <AppError
                                                    message={errors.question_vi}
                                                />
                                            )}
                                    </div>

                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title={` 
                                            <div class="flex items-center" >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 mr-3" viewBox="0 0 640 480">
                                                    <defs>
                                                        <clipPath id="a">
                                                            <path
                                                                fill-opacity=".7"
                                                                d="M-88 32h640v480H-88z"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                    <g
                                                        fill-rule="evenodd"
                                                        stroke-width="1pt"
                                                        clip-path="url(#a)"
                                                        transform="translate(88 -32)"
                                                    >
                                                        <path fill="#fff" d="M-128 32h720v480h-720z" />
                                                        <circle
                                                            cx="523.1"
                                                            cy="344.1"
                                                            r="194.9"
                                                            fill="#d30000"
                                                            transform="translate(-168.4 8.6) scale(.76554)"
                                                        />
                                                    </g>
                                                </svg>
                                                <span>Japanese</span>
                                            </div>
                                        `}
                                            required
                                            name="question_ja"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.question_ja}
                                            error={
                                                errors.question_ja &&
                                                touched.question_ja
                                            }
                                        />
                                        {errors.question_ja &&
                                            touched.question_ja && (
                                                <AppError
                                                    message={errors.question_ja}
                                                />
                                            )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title={`
                                                <div class="flex items-center" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 mr-3" viewBox="0 0 640 480">
                                                        <path fill="#012169" d="M0 0h640v480H0z" />
                                                        <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
                                                        <path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
                                                        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
                                                        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
                                                    </svg>
                                                    <span>English</span>
                                                </div>
                                                `}
                                            required
                                            name="question_en"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.question_en}
                                            error={
                                                errors.question_en &&
                                                touched.question_en
                                            }
                                        />
                                        {errors.question_en &&
                                            touched.question_en && (
                                                <AppError
                                                    message={errors.question_en}
                                                />
                                            )}
                                    </div>
                                    <hr className="mt-6 mb-3" />
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Save
                                            </Button>
                                        </span>
                                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                            <Button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    this.setState({
                                                        modalEdit: false
                                                    })
                                                }
                                                backgroundColor="bg-white "
                                                textColor="text-black"
                                                extraClass="border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue "
                                            >
                                                Cancel
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </ModalContainer>
                )}

                {modalEditAVG && (
                    <ModalContainer
                        onClick={() =>
                            this.setState({
                                modalEditAVG: false
                            })
                        }
                    >
                        <Formik
                            initialValues={{
                                group_1: this.state.group_1,
                                group_2: this.state.group_2,
                                group_3: this.state.group_3,
                                group_4: this.state.group_4,
                                group_5: this.state.group_5,
                                group_6: this.state.group_6,
                                group_7: this.state.group_7,
                                group_8: this.state.group_8,
                                total: this.state.total
                            }}
                            validationSchema={schema}
                            onSubmit={values => this.handleSubmitAVG(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                setFieldValue,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-tl-lg rounded-tr-lg p-3 border-b-2 border-gray-300 bg-gray-200 rounded-">
                                        <h6 className="label text-xl">
                                            Setting for Vietnamese Average
                                        </h6>
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <i>
                                            Enter number {">"} 0 and {"<"} 100
                                        </i>
                                        <div className="grid grid-cols-9 gap-x-3">
                                            <Input
                                                title="Group 1"
                                                name="group_1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_1}
                                                error={
                                                    errors.group_1 &&
                                                    touched.group_1
                                                }
                                            />
                                            <Input
                                                title="Group 2"
                                                name="group_2"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_2}
                                                error={
                                                    errors.group_2 &&
                                                    touched.group_2
                                                }
                                            />
                                            <Input
                                                title="Group 3"
                                                name="group_3"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_3}
                                                error={
                                                    errors.group_3 &&
                                                    touched.group_3
                                                }
                                            />
                                            <Input
                                                title="Group 4"
                                                name="group_4"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_4}
                                                error={
                                                    errors.group_4 &&
                                                    touched.group_4
                                                }
                                            />
                                            <Input
                                                title="Group 5"
                                                name="group_5"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_5}
                                                error={
                                                    errors.group_5 &&
                                                    touched.group_5
                                                }
                                            />
                                            <Input
                                                title="Group 6"
                                                name="group_6"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_6}
                                                error={
                                                    errors.group_6 &&
                                                    touched.group_6
                                                }
                                            />
                                            <Input
                                                title="Group 7"
                                                name="group_7"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_7}
                                                error={
                                                    errors.group_7 &&
                                                    touched.group_7
                                                }
                                            />
                                            <Input
                                                title="Group 8"
                                                name="group_8"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.group_8}
                                                error={
                                                    errors.group_8 &&
                                                    touched.group_8
                                                }
                                            />
                                            <Input
                                                title="Total"
                                                name="total"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.total}
                                                error={
                                                    errors.total &&
                                                    touched.total
                                                }
                                            />
                                        </div>
                                        <hr className="mt-6 mb-3" />
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Save
                                            </Button>
                                        </span>
                                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                            <Button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    this.setState({
                                                        modalEditAVG: false
                                                    })
                                                }
                                                backgroundColor="bg-white "
                                                textColor="text-black"
                                                extraClass="border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue "
                                            >
                                                Cancel
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </ModalContainer>
                )}
            </SupperAdminLayout>
        );
    }
}

export default ContextWrapper(SupperAdminSpeedUpQuestion);
