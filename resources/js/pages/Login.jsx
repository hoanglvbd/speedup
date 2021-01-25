import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import AppError from "../components/AppError";
import Button from "../components/Button";
import ContextWrapper from "../context/ContextWrapper";
const loginSchema = Yup.object({
    username: Yup.string()
        .email("Invalid email")
        .required("ID is required"),
    password: Yup.string().required("Password is required")
});
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverMessage: "",
            loading: false
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
                            type: data.type,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            joindate: data.joindate
                        };
                        localStorage.setItem(
                            "session_token",
                            data.session_token
                        );
                        localStorage.setItem("user", JSON.stringify(user));

                        if (data.type == 0) {
                            window.location.replace("/admin");
                        }
                        if (data.type == 1) {
                            window.location.replace("/");
                        }
                        if (data.type == 2) {
                            window.location.replace("company/users");
                        }

                        this.props.auth.setToken(data.session_token);
                        this.props.auth.setUser(user);
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
        const { serverMessage, loading } = this.state;
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div>
                        <img
                            className="mx-auto h-32 w-auto"
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
                                <div className="rounded-md shadow-sm">
                                    <div className="mb-3">
                                        <Input
                                            name="username"
                                            aria-label="Username"
                                            autoComplete="username"
                                            autoFocus
                                            placeholder="Email"
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
                                                    message={errors.username}
                                                />
                                            )}
                                    </div>
                                    <div className="-mt-px">
                                        <Input
                                            aria-label="Password"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
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
                                                    message={errors.password}
                                                />
                                            )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button
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
                                        Login
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default ContextWrapper(Login);
