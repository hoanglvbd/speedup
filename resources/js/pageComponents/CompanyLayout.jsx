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
    CircularProgress
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

class CompanyLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUsers: false,
            anchorEl: null,
            value: 0,
            showInvite: false,
            inviteLoading: false,

            inviteEmail: ""
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
                try {
                    const rs_invite = await window.axios.post(window.apiURL, {
                        method: "invite_user",
                        params: {
                            session_token: this.props.auth.token,
                            email: inviteEmail,
                            company_id: this.props.auth.user.id
                        }
                    });
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
            inviteEmail
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
                            <div className="flex items-center">
                                <Button
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <svg
                                        viewBox="-42 0 512 512.002"
                                        className="w-4 mr-5"
                                        fill="#333"
                                    >
                                        <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0" />
                                        <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0" />
                                    </svg>
                                    {this.props.auth.user.name}
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={this.handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center"
                                    }}
                                    getContentAnchorEl={null}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            window.location.href =
                                                window.baseURL + "/logout";
                                        }}
                                    >
                                        {this.props.t("sign_out")}
                                    </MenuItem>
                                </Menu>

                                {/*  <Dropdown
                                text={this.props.auth.user.name}
                                textColor=" text-black "
                                icon={
                                    <svg
                                        viewBox="-42 0 512 512.002"
                                        className="w-4 mr-5"
                                        fill="#333"
                                    >
                                        <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0" />
                                        <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0" />
                                    </svg>
                                }
                            >
                                <a
                                    href={window.baseURL + "/logout"}
                                    className={
                                        " hover:text-red-300 block  text-red-600 whitespace-no-wrap items-center justify-center border border-transparent text-sm leading-6 font-medium transition ease-in-out duration-150 w-full text-left"
                                    }
                                >
                                    {this.props.t("sign_out")}
                                </a>
                            </Dropdown> */}
                            </div>
                        </div>
                    </div>
                </nav>
                <Container className="my-10">
                    <div className="flex items-center justify-between mb-10">
                        <Tabs
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                            value={value}
                            onChange={this.handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab
                                component="a"
                                href="#active"
                                label="Active Member"
                                {...a11yProps(0)}
                            />
                            <Tab
                                component="a"
                                href="#pending"
                                label="Pending Member"
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
                            Invite Member
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
                        <DialogTitle id="form-dialog-title">
                            Invite member
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To invite member, please enter email address
                                here.
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
                                label="Email Address"
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
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Send Invitation letter
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                {/*  <nav className="w-56 fixed left-0 bg-white border-gray-100 shadow h-full flex flex-col p-3">
                    <Link
                        to={window.baseURL + "/company"}
                        className="text-main flex items-center"
                    >
                        <img
                            className="w-24 mb-6"
                            src={window.baseURL + "/public/images/logo.png"}
                            alt="Workflow logo"
                        />
                    </Link>
                    <div
                        onClick={() => {
                            this.setState({
                                showUsers: !showUsers
                            });
                        }}
                        className={
                            (this.props.location.pathname ==
                                "/company/users/add" ||
                            this.props.location.pathname ==
                                "/company/users/list" ||
                            this.props.location.pathname ==
                                "/company/users/pending-invite"
                                ? "active"
                                : "") + " navbar cursor-pointer"
                        }
                    >
                        Users
                    </div>
                    <Collapse
                        isOpened={
                            showUsers ||
                            this.props.location.pathname ==
                                "/company/users/add" ||
                            this.props.location.pathname ==
                                "/company/users/list" ||
                            this.props.location.pathname ==
                                "/company/users/pending-invite"
                        }
                    >
                        <div className="flex flex-col">
                            <Link
                                to={"/company/users/add"}
                                className={
                                    (this.props.location.pathname ==
                                    "/company/users/add"
                                        ? "active"
                                        : "") + " navbar ml-3"
                                }
                            >
                                Create member
                            </Link>
                            <Link
                                to={"/company/users/pending-invite"}
                                className={
                                    (this.props.location.pathname ==
                                    "/company/users/pending-invite"
                                        ? "active"
                                        : "") + " navbar ml-3"
                                }
                            >
                                List Pending member
                            </Link>
                            <Link
                                to={"/company/users/list"}
                          
                                className={
                                    (this.props.location.pathname ==
                                    "/company/users/list"
                                        ? "active"
                                        : "") + " navbar ml-3"
                                }
                            >
                                List members
                            </Link>
                        </div>
                    </Collapse>

                    <hr />

                    <a
                        href={window.baseURL + "/logout"}
                        className={" navbar text-red-600"}
                    >
                        Logout
                    </a>
                </nav>
                <main className="min-h-full flex gap-6  bg-gray-100">
                    {this.props.children}
                </main> */}
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
