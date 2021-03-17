import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";
import SwipeableViews from "react-swipeable-views";
import {
    Button,
    Container,
    Menu,
    MenuItem,
    CircularProgress,
    Typography,
    Link as MeterialLink
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import UserCompanyList from "../pages/UserCompanyList";
import UserCompanyPending from "../pages/UserCompanyPending";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CompanyHeader from "./CompanyHeader";
import { Formik } from "formik";

class CompanyLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUsers: false,
            anchorEl: null,
            value: 0,
            showInvite: false,
            inviteLoading: false,

            inviteEmail: "",
            showDialog: false,
            dialogTitle: "",
            dialogContent: "",

            company_detail: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeIndex = this.handleChangeIndex.bind(this);
    }
    componentDidMount() {
        const { hash } = this.props.location;
        if (hash == "#active") {
            this.setState({
                value: 0
            });
        } else if (hash == "#pending") {
            this.setState({
                value: 1
            });
        }
    }

    handleClick(event) {
        this.setState({
            anchorEl: event.currentTarget
        });
    }

    handleClose() {
        this.setState({
            anchorEl: null
        });
    }
    handleChange(event, newValue) {
        this.setState({
            value: newValue
        });
    }
    handleChangeIndex(index) {
        this.setState({
            value: index
        });
    }
    handleInvite(event) {
        event.preventDefault();
        const { inviteEmail } = this.state;

        this.setState(
            {
                inviteLoading: true
            },
            async () => {
                const rs_check = await window.axios.post(window.apiURL, {
                    method: "check_email_exits",
                    params: {
                        email: inviteEmail
                    }
                });
                if (rs_check.data.result_code == 0) {
                    try {
                        const rs_invite = await window.axios.post(
                            window.apiURL,
                            {
                                method: "invite_user",
                                params: {
                                    session_token: this.props.auth.token,
                                    email: inviteEmail,
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
                    } catch (error) {
                        this.props.notify.error("Unable to send email!");
                    } finally {
                        this.setState({
                            inviteLoading: false
                        });
                    }
                } else {
                    var rs_text = rs_check.data.result_message_text;
                    rs_text = rs_text.replace("{email}", inviteEmail);
                    this.props.notify.error(rs_text);
                    this.setState({
                        inviteLoading: false
                    });
                }
            }
        );
    }

    render() {
        const {
            showUsers,
            anchorEl,
            value,
            showInvite,
            inviteLoading,
            inviteEmail,
            company_detail
        } = this.state;
        return (
            <>
                <CompanyHeader
                    set_company_detail={item => {
                        this.setState({
                            company_detail: item
                        });
                    }}
                />

                <Container className="my-10">
                    <div className="flex items-center justify-between mb-10">
                        <Tabs
                            indicatorColor="primary"
                            textColor="primary"
                            value={value}
                            onChange={this.handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab
                                component="a"
                                href="#active"
                                label="Danh Sách Thành Viên"
                                {...a11yProps(0)}
                            />
                            <Tab
                                component="a"
                                href="#pending"
                                label="Thành Viên Đã Mời"
                                {...a11yProps(1)}
                            />
                        </Tabs>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    showInvite: !showInvite
                                });
                            }}
                            startIcon={<AddIcon />}
                        >
                            Mời Thành Viên
                        </Button>
                    </div>
                    <SwipeableViews
                        axis="x"
                        index={value}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir="ltr">
                            <UserCompanyList />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir="ltr">
                            <UserCompanyPending />
                        </TabPanel>
                    </SwipeableViews>
                </Container>
                <Dialog
                    open={showInvite}
                    onClose={() =>
                        this.setState({
                            showInvite: !showInvite
                        })
                    }
                    aria-labelledby="form-dialog-title"
                >
                    {inviteLoading && (
                        <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-center z-50">
                            <div className="absolute right-0 left-0 top-0 bottom-0 bg-white opacity-50" />
                            <CircularProgress />
                        </div>
                    )}
                    <form onSubmit={this.handleInvite}>
                        {company_detail.point > 0 ? (
                            <>
                                <DialogTitle id="form-dialog-title">
                                    Mời Thành Viên
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Số điểm hiện tại của bạn là{" "}
                                        {company_detail.point} điểm. Mất 1 điểm
                                        để mời thành viên, vui lòng nhập địa chỉ
                                        email.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        value={inviteEmail}
                                        onChange={event =>
                                            this.setState({
                                                inviteEmail: event.target.value
                                            })
                                        }
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        required
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() =>
                                            this.setState({
                                                showInvite: false
                                            })
                                        }
                                        color="default"
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" color="primary">
                                        Gửi Thư Mời
                                    </Button>
                                </DialogActions>
                            </>
                        ) : (
                            <>
                                <DialogTitle id="alert-dialog-title">
                                    Số lượt tạo thành viên đã bị giới hạn. Vui
                                    lòng nâng cấp gói dịch vụ.
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
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
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                showInvite: !showInvite
                                            });
                                        }}
                                        color="primary"
                                    >
                                        OK
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </form>
                </Dialog>
            </>
        );
    }
}

export default ContextWrapper(withRouter(withTranslation()(CompanyLayout)));
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}
