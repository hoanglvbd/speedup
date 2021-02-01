import { Formik } from "formik";
import * as Yup from "yup";

import React, { Component } from "react";
import ModalContainer from "../components/ModalContaner";
import Input from "../components/Input";
import AppError from "../components/AppError";
import Button from "../components/Button";
import Select from "react-select";
import GlobalLoading from "../components/GlobalLoading";
import AppDatePicker from "../components/AppDatePicker";
import ContextWrapper from "../context/ContextWrapper";
import moment from "moment";

const schema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string(),
    confirm_password: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Confirm password did not match"
    )
});
class StudentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            serverErors: {},
            severMessage: "",

            loading: false
        };

        this.handleEdit = this.handleEdit.bind(this);
    }

    handleEdit(values) {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.post(window.apiURL, {
                        method: "edit_user",
                        params: {
                            user_id: this.props.user.user_id,
                            session_token: this.props.auth.token,
                            email: values.email,
                            password: values.password,
                            name: values.name,
                            birthday: moment(values.birthday).format(
                                "YYYY-MM-DD"
                            ),
                            gender: values.gender,
                            phone: values.phone,
                            address: values.address,
                            max_time: values.max_time
                        }
                    });
                    if (rs.data.result_code == 1) {
                        this.props.notify.success(rs.data.result_message_text);
                    } else {
                        this.props.notify.error(rs.data.result_message_text);
                    }
                } catch (error) {
                    this.props.notify.error(error);
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }

    componentDidMount() {
        this.setState({
            max_time: this.props.user.max_time
        });
    }

    render() {
        const { visible, user, handleClose, resultCount } = this.props;
        const { serverErors, showPassword, loading, severMessage } = this.state;
        return visible ? (
            <ModalContainer onClick={handleClose}>
                {loading && (
                    <GlobalLoading
                        containerStyle={{ background: "rgba(000,000,000,0.3)" }}
                        title=""
                    />
                )}
                <Formik
                    initialValues={{
                        email: user.email,
                        name: user.name,
                        birthday: new Date(user.birthday),
                        gender: user.gender,
                        phone: user.phone,
                        address: user.address,
                        max_time: user.max_time
                    }}
                    validationSchema={schema}
                    onSubmit={values => this.handleEdit(values)}
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
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="border-b-2 pb-2 border-blue-700 text-blue-700 font-semibold text-lg">
                                Edit user infomation
                            </div>
                            {severMessage !== "" && (
                                <AppError message={severMessage} />
                            )}

                            <div>
                                <label className="label">
                                    Maximum allowed time submit
                                </label>
                                <select
                                    name="max_time"
                                    value={user.max_time}
                                    disabled={resultCount == 2}
                                    onChange={handleChange}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                                {resultCount == 2 && (
                                    <AppError
                                        message={
                                            "User has submitted full time allowed.. To decrease allowed time, please delete a user result"
                                        }
                                    />
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-6">
                                <div className="">
                                    <Input
                                        required
                                        placeholder="Name"
                                        name="name"
                                        title="Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        error={errors.name && touched.name}
                                    />
                                    {errors.name && touched.name && (
                                        <AppError message={errors.name} />
                                    )}
                                </div>
                                <div className="">
                                    <Input
                                        required
                                        placeholder="Email"
                                        name="email"
                                        title="Email"
                                        disabled
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        error={errors.email && touched.email}
                                    />
                                    {errors.email && touched.email && (
                                        <AppError message={errors.email} />
                                    )}
                                </div>
                            </div>
                            <div>
                                <Input
                                    required
                                    placeholder="address"
                                    name="address"
                                    title="Address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    error={errors.address && touched.address}
                                />
                                {errors.address && touched.address && (
                                    <AppError message={errors.address} />
                                )}
                            </div>
                            <div>
                                <Input
                                    required
                                    placeholder="phone"
                                    name="phone"
                                    title="Phone"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phone}
                                    error={errors.phone && touched.phone}
                                />
                                {errors.phone && touched.phone && (
                                    <AppError message={errors.phone} />
                                )}
                            </div>
                            <div>
                                <label className="label">Gender</label>
                                <select
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                >
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="" className="label">
                                    Birthday
                                </label>
                                <AppDatePicker
                                    value={values.birthday}
                                    isClearable={false}
                                    onChange={date =>
                                        setFieldValue("birthday", date)
                                    }
                                />
                            </div>
                            <div className="">
                                <Input
                                    title="Password"
                                    type={!showPassword ? "password" : "text"}
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    error={
                                        (errors.password && touched.password) ||
                                        serverErors.password
                                    }
                                    IconLeft={() => (
                                        <button
                                            onClick={() =>
                                                this.setState({
                                                    showPassword: !showPassword
                                                })
                                            }
                                            type="button"
                                            className="absolute right-0 top-0 p-2"
                                        >
                                            <img
                                                className="w-4"
                                                src={
                                                    window.baseURL +
                                                    (showPassword
                                                        ? "/public/images/visibility.svg"
                                                        : "/public/images/invisibility.svg")
                                                }
                                            />
                                        </button>
                                    )}
                                />
                                {errors.password && touched.password && (
                                    <AppError message={errors.password} />
                                )}

                                {serverErors.password &&
                                    serverErors.password.map(e => (
                                        <AppError message={e} key={e} />
                                    ))}
                            </div>

                            <div className="mt-6 flex justify-between border-t-2 border-blue-700 pt-3">
                                <Button type="submit" loading={loading}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </ModalContainer>
        ) : null;
    }
}

export default ContextWrapper(StudentEdit);
