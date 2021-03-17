import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import AppError from "../components/AppError";
import ContextWrapper from "../context/ContextWrapper";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { LoginRedirect } from "../util/loginRedirect";

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
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverMessage: "",
            loading: false,
            showLanguage: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        this.setState(
            {
                serverMessage: "",
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.post(window.apiURL, {
                        method: "is_login",
                        params: {
                            email: values.username,
                            password: values.password
                        }
                    });
                    if (rs.data.result_code == 1) {
                        const data = rs.data.result_data;
                        const user = {
                            id: data.id,
                            type_member: data.type_member,
                            type: data.type,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            max_users: data.max_users,
                            joindate: data.joindate
                        };
                        localStorage.setItem(
                            "session_token",
                            data.session_token
                        );
                        localStorage.setItem("user", JSON.stringify(user));

                        this.props.auth.setToken(data.session_token);
                        this.props.auth.setUser(user);

                        /*    LoginRedirect(user); */
                    } else {
                        this.setState({
                            serverMessage: rs.data.result_message_text
                        });
                    }
                } catch (error) {
                    this.setState({
                        serverMessage: "Server error"
                    });
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    render() {
        const { serverMessage, loading, showLanguage } = this.state;
        const { t, lang, i18n } = this.props;
        const loginSchema = Yup.object({
            username: Yup.string()
                .email(this.props.t("email_invalid"))
                .required(this.props.t("email_required")),
            password: Yup.string().required(this.props.t("password_required"))
        });
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full">
                        <div>
                            <img
                                className="mx-auto h-16 w-auto"
                                src={window.baseURL + "/public/images/logo.png"}
                                alt="Workflow"
                            />
                        </div>

                        {serverMessage !== "" && (
                            <p
                                className="text-red-800 mt-8 text-center"
                                role="alert"
                            >
                                <strong> {serverMessage} </strong>
                            </p>
                        )}
                        <Formik
                            initialValues={{
                                username: "",
                                password: ""
                            }}
                            validationSchema={loginSchema}
                            onSubmit={values => this.handleSubmit(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form className="mt-8" onSubmit={handleSubmit}>
                                    <div>
                                        <div className="mb-3">
                                            <TextField
                                                autoComplete="email"
                                                label="Email"
                                                name="username"
                                                fullWidth
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.username}
                                                error={
                                                    errors.username &&
                                                    touched.username
                                                }
                                            />

                                            {errors.username &&
                                                touched.username && (
                                                    <AppError
                                                        message={
                                                            errors.username
                                                        }
                                                    />
                                                )}
                                        </div>
                                        <div>
                                            <TextField
                                                autoComplete="password"
                                                label="Password"
                                                name="password"
                                                fullWidth
                                                type="password"
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                                error={
                                                    errors.password &&
                                                    touched.password
                                                }
                                            />
                                            {errors.password &&
                                                touched.password && (
                                                    <AppError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                )}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={loading}
                                            color="primary"
                                        >
                                            {t("login")}
                                        </Button>
                                    </div>
                                    {/*     <Button
                                            type="submit"
                                            loading={loading}
                                            extraClass="w-full"
                                        >
                                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                <svg
                                                    className="h-5 w-5 text-white transition ease-in-out duration-150"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                            {t("login")}
                                        </Button>
                                    </div> */}
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="relative">
                    <div className="fixed" style={{ bottom: 15, left: 15 }}>
                        <div className="relative">
                            <span className="inline-block w-full rounded shadow border">
                                <button
                                    onClick={() => {
                                        console.log("click");
                                        this.setState({
                                            showLanguage: !showLanguage
                                        });
                                    }}
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
                                                    (lang.lang == 1
                                                        ? "/public/images/vi-flag.svg"
                                                        : lang.lang == 2
                                                        ? "/public/images/ja-flag.svg"
                                                        : "/public/images/en-flag.svg")
                                                }
                                                className="w-6"
                                            />
                                            <span className="font-semibold block whitespace-no-wrap">
                                                {lang.lang == 1
                                                    ? "Tiếng Việt"
                                                    : lang.lang == 2
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
                                                lang.setLang(1);
                                            }}
                                            role="option"
                                            className={
                                                (lang.lang == 1
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
                                                lang.setLang(2);
                                            }}
                                            role="option"
                                            className={
                                                (lang.lang == 2
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
                                                lang.setLang(3);
                                            }}
                                            role="option"
                                            className={
                                                (lang.lang == 3
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
                </div>
            </>
        );
    }
}

export default ContextWrapper(withTranslation()(Login));
