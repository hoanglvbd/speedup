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
import CompanyHeader from "./CompanyHeader";

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
                <CompanyHeader />
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
