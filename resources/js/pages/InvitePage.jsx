import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { Component } from "react";
import { withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";

const STAGE = {
    showInvite: "showInvite",
    accepted: "accepted",
    declined: "declined"
};
class InviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: STAGE.showInvite,
            loading: false
        };
        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
    }
    componentDidMount() {
        console.log(this.props.match.params);
    }

    handleDecline() {
        this.setState({
            stages: STAGE.declined
        });
    }
    handleAccept() {
        this.setState(
            {
                loading: false
            },
            async () => {
                window.axios.post(window.apiURL, {
                    method: "agree_join_member",
                    params: {
                        /*    session_token: this.props.auth.token,
                    user_invited_id: id,
                    user_id : 
                    invite_id :  */
                    }
                });
            }
        );
    }
    render() {
        const { stages, loading } = this.state;
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
                <div className="absolute right-0 bottom-0 left-0 top-0 flex justify-center items-center">
                    <div className="sm:w-144 w-full px-6 border shadow py-3">
                        {stages == STAGE.showInvite && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Mời Tham Gia Thành Viên Công Ty TNHH Nhà
                                    Tuyển Dụng
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Nhà tuyển dụng Do Huu Thien từ công ty TNHH
                                    Nhà Tuyển Dụng. Muốn mời bạn tham gia vào
                                    đội ngũ nhân viên hoặc quản lý tại công ty
                                    họ. Bạn có muốn tham gia làm thành viên tại
                                    công ty TNHH Nhà Tuyển Dụng?
                                </Typography>
                                <div className="justify-end pt-6 flex ">
                                    <div className="mx-3">
                                        <Button
                                            disabled={loading}
                                            variant="text"
                                            color="default"
                                            onClick={this.handleDecline}
                                        >
                                            Declined
                                        </Button>
                                    </div>
                                    <div className="mx-3">
                                        <Button
                                            disabled={loading}
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleAccept}
                                        >
                                            Accept
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
                                <Typography variant="body1" gutterBottom>
                                    Bạn có thể đóng trang này.
                                </Typography>
                            </Box>
                        )}
                        {stages == STAGE.declined && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Chấp nhận từ chối lời mời!.
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Bạn có thể đóng trang này.
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ContextWrapper(InviewPage));
