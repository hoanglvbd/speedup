import { Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import AppError from "../components/AppError";
import ModalContainer from "../components/ModalContaner";
import SupperAdminLayout from "../pageComponents/SupperAdminLayout";
import Input from "../components/Input";
import ContextWrapper from "../context/ContextWrapper";
import Button from "../components/Button";

const editQuestionSchema = Yup.object({
    question_en: Yup.string().required("Can't leave it blank"),
    question_ja: Yup.string().required("Can't leave it blank"),
    question_vi: Yup.string().required("Can't leave it blank")
});
class SupperAdminTranslation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [],
            modalEdit: false,
            currentWord: {},
            loading: false
        };
        this.getWord = this.getWord.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.genarateLangArray = this.genarateLangArray.bind(this);
    }
    componentDidMount() {
        this.getWord();
    }
    getWord() {
        window.axios.post(window.baseURL + "/api/get_translation").then(rs => {
            const en = rs.data.en;
            const ja = rs.data.ja;
            const vi = rs.data.vi;

            const arr = [];
            for (const key in en) {
                let obj = {
                    lang_key: key,
                    lang_en: en[key],
                    lang_ja: ja[key],
                    lang_vi: vi[key]
                };
                arr.push(obj);
            }
            this.setState({
                words: arr
            });
        });
    }
    renderBody() {
        const { words } = this.state;
        return words.map(word => (
            <tr
                key={word.lang_key}
                className="hover:bg-gray-200 hover:cursor-default"
            >
                <td className="border px-6 py-4 text-sm font-medium">
                    {word.lang_vi}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {word.lang_ja}
                </td>
                <td className="border px-6 py-4 text-sm font-medium">
                    {word.lang_en}
                </td>
                <td className="border px-6 py-4 whitespace-no-wrap text-center ">
                    <button
                        onClick={() => {
                            this.setState({
                                modalEdit: true,
                                currentWord: word
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
    handleSubmitEdit(values) {
        const { currentWord } = this.state;
        let wordsCopy = this.state.words;

        const index = wordsCopy.findIndex(
            e => e.lang_key == currentWord.lang_key
        );
        wordsCopy[index].lang_en = values.question_en;
        wordsCopy[index].lang_vi = values.question_vi;
        wordsCopy[index].lang_ja = values.question_ja;

        this.setState(
            {
                words: wordsCopy,
                loading: true
            },
            () => {
                const data = this.genarateLangArray();

                window.axios
                    .put(window.baseURL + "/api/edit_translation", {
                        data: data
                    })
                    .then(rs => {
                        this.setState({
                            loading: false,
                            modalEdit: false
                        });
                        this.props.notify.success("Edit success!");
                    })
                    .catch(() => {
                        this.props.notify.error();
                    });
            }
        );
    }
    genarateLangArray() {
        const { words } = this.state;
        let data = {};
        const en = words.map(word => {
            return [word.lang_key, word.lang_en];
        });
        const vi = words.map(word => {
            return [word.lang_key, word.lang_vi];
        });
        const ja = words.map(word => {
            return [word.lang_key, word.lang_ja];
        });
        data.en = { ...en };
        data.vi = { ...vi };
        data.ja = { ...ja };
        return data;
    }
    render() {
        const { modalEdit, currentWord, loading } = this.state;
        return (
            <SupperAdminLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="max-w-7xl mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Translation
                        </h1>
                    </div>

                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
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
                                        {this.renderBody()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                                question_en: currentWord.lang_en,
                                question_ja: currentWord.lang_ja,
                                question_vi: currentWord.lang_vi
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
                                            Edit Word
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
            </SupperAdminLayout>
        );
    }
}

export default ContextWrapper(SupperAdminTranslation);
