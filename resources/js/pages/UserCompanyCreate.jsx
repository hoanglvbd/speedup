import { Formik } from "formik";
import React, { Component } from "react";
import AppDatePicker from "../components/AppDatePicker";
import Button from "../components/Button";
import Input from "../components/Input";
import ContextWrapper from "../context/ContextWrapper";
import CompanyLayout from "../pageComponents/CompanyLayout";
import * as Yup from "yup";
import AppError from "../components/AppError";
import CheckBox from "../components/CheckBox";
import moment from "moment";

const addschema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Confirm password did not match")
});
class UserCompanyCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            loading: false,
            send_email: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(values) {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs_create = await window.axios.post(window.apiURL, {
                        method: "create_user",
                        params: {
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
                    if (rs_create.data.result_code == 1) {
                        this.props.notify.success(
                            rs_create.data.result_message_text
                        );

                        if (this.state.send_email) {
                            const rs_invite = await window.axios.post(
                                window.apiURL,
                                {
                                    method: "invite_user",
                                    params: {
                                        session_token: this.props.auth.token,
                                        email: values.email,
                                        company_id: this.props.auth.user.id
                                    }
                                }
                            );
                            if (rs_invite.data.result_code == 1) {
                                this.props.notify.success(
                                    rs_invite.data.result_message_text
                                );
                            } else {
                                this.props.notify.error(
                                    rs_invite.data.result_message_text
                                );
                            }
                        }
                    } else {
                        this.props.notify.error(
                            rs_create.data.result_message_text
                        );
                    }
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
        const { showPassword, loading } = this.state;
        const { auth } = this.props;
        return (
            <CompanyLayout>
                <div className="w-full ml-64 mr-3">
                    <div className="flex justify-between items-center mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Create a user
                        </h1>
                    </div>

                    {/*  */}
                    <div className="md:w-6/12 mx-auto">
                        <p className="italic text-red-500 mb-6">
                            Bạn có {auth.user.max_users} lượt tạo
                        </p>
                        <Formik
                            initialValues={{
                                email: "",
                                name: "",
                                birthday: new Date(),
                                gender: 1,
                                phone: "",
                                address: "",
                                max_time: 2,
                                password: "",
                                confirm_password: ""
                            }}
                            validationSchema={addschema}
                            onSubmit={values => this.handleSubmit(values)}
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
                                <form
                                    onSubmit={handleSubmit}
                                    className="shadow border rounded px-6 py-2 bg-white mb-12"
                                >
                                    <Input
                                        title="Email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        error={errors.email && touched.email}
                                    />

                                    {errors.email && touched.email && (
                                        <AppError message={errors.email} />
                                    )}

                                    <Input
                                        title="Name"
                                        name="name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        error={errors.name && touched.name}
                                    />

                                    {errors.name && touched.name && (
                                        <AppError message={errors.name} />
                                    )}
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
                                    <label className="label" htmlFor="">
                                        Gender
                                    </label>
                                    <select
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="mb-2"
                                        name="gender"
                                    >
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                    </select>

                                    <Input
                                        title="Phone"
                                        name="phone"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.phone}
                                        error={errors.phone && touched.phone}
                                    />

                                    {errors.phone && touched.phone && (
                                        <AppError message={errors.phone} />
                                    )}

                                    <Input
                                        title="Address"
                                        name="address"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.address}
                                        error={
                                            errors.address && touched.address
                                        }
                                    />
                                    {errors.address && touched.address && (
                                        <AppError message={errors.address} />
                                    )}

                                    <div>
                                        <label className="label">
                                            Maximum allowed time submit
                                        </label>
                                        <select
                                            name="max_time"
                                            value={values.max_time}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Input
                                            title="Password"
                                            required
                                            type={
                                                !showPassword
                                                    ? "password"
                                                    : "text"
                                            }
                                            placeholder="Password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={
                                                errors.password &&
                                                touched.password
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
                                        {errors.password &&
                                            touched.password && (
                                                <AppError
                                                    message={errors.password}
                                                />
                                            )}
                                    </div>
                                    <div className="">
                                        <Input
                                            required
                                            title="Confirm Password"
                                            type={
                                                !showPassword
                                                    ? "password"
                                                    : "text"
                                            }
                                            placeholder="Password"
                                            name="confirm_password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.confirm_password}
                                            error={
                                                errors.confirm_password &&
                                                touched.confirm_password
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
                                        {errors.confirm_password &&
                                            touched.confirm_password && (
                                                <AppError
                                                    message={
                                                        errors.confirm_password
                                                    }
                                                />
                                            )}
                                    </div>
                                    {/* 
                                    <div className="flex items-center mt-6">
                                        <CheckBox
                                            id="generate_pass"
                                            checked={this.state.send_email}
                                            onChange={() => {
                                                this.setState({
                                                    send_email: !this.state
                                                        .send_email
                                                });
                                            }}
                                        />
                                        <label
                                            htmlFor="generate_pass"
                                            className="pl-3 label"
                                        >
                                            Send email inviation
                                        </label>
                                    </div> */}
                                    <div className="flex justify-end mt-6 mb-3">
                                        <Button type="submit" loading={loading}>
                                            Create
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </CompanyLayout>
        );
    }
}

export default ContextWrapper(UserCompanyCreate);
