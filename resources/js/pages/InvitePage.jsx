import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@material-ui/core";
import { TextFieldsTwoTone } from "@material-ui/icons";
import React from "react";
import { Component } from "react";
import { withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";
import * as Yup from "yup";
import { Formik } from "formik";
import { values } from "lodash";
import AppError from "../components/AppError";
import GlobalLoading from "../components/GlobalLoading";
import { LoginRedirect } from "../util/loginRedirect";
const STAGE = {
    showInvite: "showInvite",
    accepted: "accepted",
    declined: "declined",
    Create: "Create"
};

const schema = Yup.object({
    password: Yup.string().required("Password is required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    confirm_password: Yup.string()
        .required("Password is required")
        .oneOf([Yup.ref("password"), null], "Confirm password did not match")
});

class InviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: STAGE.showInvite,
            loading: false,
            company: {},

            declineMessage: "",
            showDialog: false,
            company_detail: {}
        };
        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
        this.fetchCompany = this.fetchCompany.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleAgree = this.handleAgree.bind(this);
    }
    componentDidMount() {
        this.fetchCompany();
    }
    fetchCompany() {
        window.axios
            .post(window.apiURL, {
                method: "get_detail_company",
                params: {
                    session_token: "",
                    company_id: "",
                    user_code: this.props.match.params.user_code
                }
            })
            .then(rs =>
                this.setState({
                    company: rs.data.result_data
                })
            );
    }
    handleDecline() {
        const { company } = this.state;
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.post(window.apiURL, {
                        method: "not_agree_join_member",
                        params: {
                            user_id: company.company_id,
                            invite_id: this.props.match.params.id_invite
                        }
                    });

                    if (rs.data.result_code == 1) {
                        this.setState({
                            stages: STAGE.declined,
                            declineMessage: rs.data.result_message_text
                        });
                    } else {
                        this.props.notify.error();
                    }
                } catch (error) {
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    handleAgree() {}
    handleCreate(values) {
        const { company } = this.state;
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    //create company
                    const create_rs = await window.axios.post(window.apiURL, {
                        method: "create_company",
                        params: {
                            email: values.email,
                            password: values.password,
                            company_name: company.company_name,
                            company_address: company.company_address,
                            website: company.company_website,
                            name: company.name,
                            phone: company.phone
                        }
                    });

                    if (create_rs.data.result_code == 1) {
                        this.props.notify.success(
                            create_rs.data.result_message_text
                        );
                        //agreee
                        try {
                            const agree_rs = await window.axios.post(
                                window.apiURL,
                                {
                                    method: "agree_join_member",
                                    params: {
                                        user_invited_id:
                                            create_rs.data.result_data.emp_id,
                                        user_id: company.company_id,
                                        invite_id: this.props.match.params
                                            .id_invite
                                    }
                                }
                            );
                            if (agree_rs.data.result_code == 1) {
                                this.props.notify.success(
                                    agree_rs.data.result_message_text
                                );

                                const member_rs = await window.axios.post(
                                    window.apiURL,
                                    {
                                        method: "is_login",
                                        params: {
                                            email: values.email,
                                            password: values.password
                                        }
                                    }
                                );

                                const data = member_rs.data.result_data;
                                const user = {
                                    id: data.id,
                                    type: data.type,
                                    type_member: data.type_member,
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
                                localStorage.setItem(
                                    "user",
                                    JSON.stringify(user)
                                );

                                this.props.auth.setToken(data.session_token);
                                this.props.auth.setUser(user);
                                /* 
                                LoginRedirect(user); */
                            } else {
                                this.setState({
                                    showDialog: true,
                                    dialogTitle: "Thông Báo!",
                                    dialogContent:
                                        agree_rs.data.result_message_text
                                });
                            }
                        } catch (error) {
                            this.props.notify.error();
                        }
                    } else {
                        this.props.notify.error(
                            create_rs.data.result_message_text
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
    handleAccept() {
        this.setState({
            stages: STAGE.Create
        });
        /* this.setState(
            {
                loading: false
            },
            async () => {
                window.axios.post(window.apiURL, {
                    method: "agree_join_member",
                    params: {
                
                    }
                });
            }
        ); */
    }
    render() {
        const {
            stages,
            loading,
            company,
            declineMessage,
            showDialog,
            dialogTitle,
            dialogContent
        } = this.state;
        return (
            <>
                <nav className="shadow border-b z-10 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div
                                    className="flex-shrink-0"
                                    style={{ zIndex: 999 }}
                                >
                                    <a href={window.baseURL}>
                                        <img
                                            className="h-12"
                                            src={
                                                window.baseURL +
                                                "/public/images/logo.png"
                                            }
                                            alt="Workflow logo"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="absolute right-0 bottom-0 left-0 top-0 flex justify-center items-center bg-gray-100">
                    <div className="sm:w-144 w-full px-6 border shadow py-3 bg-white">
                        {company.point <= 0 ? (
                            <Box>
                                <img
                                    src={"https://viecoi.vn/" + company.logo}
                                    className="w-40 h-40 rounded object-contain mx-auto mb-6"
                                />
                                <Typography variant="h6" gutterBottom>
                                    Số lượt tạo thành viên đã bị giới hạn. Vui
                                    lòng nâng cấp gói dịch vụ.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Vui Lòng Truy Cập: <br />
                                    <a
                                        href="https://viecoi.vn/employer/cvpayment"
                                        target="_blank"
                                        className="text-blue-600"
                                    >
                                        https://viecoi.vn/employer/cvpayment
                                    </a>
                                    <br />
                                    để nâng cáp gói dịch vụ
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {stages == STAGE.showInvite && (
                                    <Box>
                                        <img
                                            src={
                                                "https://viecoi.vn/" +
                                                company.logo
                                            }
                                            className="w-40 h-40 rounded object-contain mx-auto mb-6"
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            Mời Tham Gia Thành Viên{" "}
                                            {company.company_name}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                        >
                                            Nhà tuyển dụng {company.name} từ{" "}
                                            {company.company_name}. Muốn mời bạn
                                            tham gia vào đội ngũ nhân viên hoặc
                                            quản lý tại công ty họ. Bạn có muốn
                                            tham gia làm thành viên tại{" "}
                                            {company.company_name}?
                                        </Typography>
                                        <div className="justify-end pt-6 flex ">
                                            <div className="mx-3">
                                                <Button
                                                    disabled={loading}
                                                    variant="text"
                                                    color="secondary"
                                                    onClick={this.handleDecline}
                                                >
                                                    Từ Chối
                                                </Button>
                                            </div>
                                            <div className="mx-3">
                                                <Button
                                                    disabled={loading}
                                                    variant="text"
                                                    color="primary"
                                                    onClick={this.handleAccept}
                                                >
                                                    Chấp Nhận
                                                </Button>
                                            </div>
                                        </div>
                                    </Box>
                                )}
                                {stages == STAGE.accepted && (
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Chấp nhận lời mời thành công!
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                        >
                                            Bạn có thể đóng trang này.
                                        </Typography>
                                    </Box>
                                )}
                                {stages == STAGE.declined && (
                                    <Box>
                                        <img
                                            src={
                                                "https://viecoi.vn/" +
                                                company.logo
                                            }
                                            className="w-40 h-40 rounded object-contain mx-auto mb-6"
                                        />
                                        <Typography variant="h6" gutterBottom>
                                            {declineMessage}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                        >
                                            Bạn có thể đóng trang này.
                                        </Typography>
                                    </Box>
                                )}
                                {stages == STAGE.Create && (
                                    <Box>
                                        {loading && (
                                            <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-center z-50">
                                                <div className="absolute right-0 left-0 top-0 bottom-0 bg-white opacity-50" />
                                                <CircularProgress />
                                            </div>
                                        )}

                                        <Typography variant="h5" gutterBottom>
                                            Tạo tài khoản
                                        </Typography>
                                        <div className="mb-3 mt-10">
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Tên Công Ty
                                            </Typography>
                                            <TextField
                                                id="company_name"
                                                fullWidth
                                                value={company.company_name}
                                                disabled
                                                required
                                            />
                                        </div>
                                        <div className="my-3">
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Địa chỉ
                                            </Typography>
                                            <TextField
                                                id="company_address"
                                                fullWidth
                                                value={company.company_address}
                                                disabled
                                            />
                                        </div>
                                        <div className="my-3">
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Website
                                            </Typography>
                                            <TextField
                                                id="company_website"
                                                fullWidth
                                                disabled
                                                value={company.company_website}
                                            />
                                        </div>

                                        <div className="my-3">
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Người liên hệ
                                            </Typography>
                                            <TextField
                                                id="name"
                                                fullWidth
                                                disabled
                                                value={company.name}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                            >
                                                Điện thoại
                                            </Typography>
                                            <TextField
                                                id="phone"
                                                fullWidth
                                                disabled
                                                value={company.phone}
                                            />
                                        </div>
                                        <hr />

                                        <Formik
                                            initialValues={{
                                                password: "",
                                                confirm_password: "",
                                                email: ""
                                            }}
                                            validationSchema={schema}
                                            onSubmit={values =>
                                                this.handleCreate(values)
                                            }
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
                                                    <div className="my-3">
                                                        <Typography
                                                            variant="subtitle1"
                                                            gutterBottom
                                                        >
                                                            Email
                                                        </Typography>
                                                        <TextField
                                                            id="email"
                                                            fullWidth
                                                            type="email"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                            error={
                                                                errors.email &&
                                                                touched.email
                                                            }
                                                            value={values.email}
                                                        />

                                                        {errors.email &&
                                                            touched.email && (
                                                                <AppError
                                                                    message={
                                                                        errors.email
                                                                    }
                                                                />
                                                            )}
                                                    </div>
                                                    <div className="my-3">
                                                        <Typography
                                                            variant="subtitle1"
                                                            gutterBottom
                                                        >
                                                            Mật Khẩu
                                                        </Typography>
                                                        <TextField
                                                            id="phone"
                                                            value={
                                                                values.password
                                                            }
                                                            name="password"
                                                            placeholder="******"
                                                            type="password"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={
                                                                values.password
                                                            }
                                                            error={
                                                                errors.password &&
                                                                touched.password
                                                            }
                                                            fullWidth
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

                                                    <div className="my-3">
                                                        <Typography
                                                            variant="subtitle1"
                                                            gutterBottom
                                                        >
                                                            Nhập Lại Mật Khẩu
                                                        </Typography>
                                                        <TextField
                                                            id="phone"
                                                            placeholder="******"
                                                            name="confirm_password"
                                                            type="password"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            value={
                                                                values.confirm_password
                                                            }
                                                            error={
                                                                errors.confirm_password &&
                                                                touched.confirm_password
                                                            }
                                                            fullWidth
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
                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="text"
                                                            type="submit"
                                                            color="primary"
                                                        >
                                                            Tạo Tài Khoản
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </Box>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <Dialog
                    open={showDialog}
                    onClose={() => {
                        this.setState({
                            showDialog: false
                        });
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {dialogTitle}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {dialogContent}
                            Truy Cập:
                            <a
                                href="https://viecoi.vn/employer/cvpayment"
                                target="_blank"
                            >
                                https://viecoi.vn/employer/cvpayment
                            </a>
                            để nâng cáp gói dịch vũ
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.setState({
                                    showDialog: false
                                });
                            }}
                            color="primary"
                        >
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withRouter(ContextWrapper(InviewPage));
