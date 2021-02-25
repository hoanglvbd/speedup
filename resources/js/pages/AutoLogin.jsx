import React from "react";
import { Component } from "react";
import { withRouter } from "react-router-dom";

class AutoLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.login();
    }
    async login() {
        const { user_id, code } = this.props.match.params;
        try {
            const rs = await window.axios.post(window.apiURL, {
                method: "login_speedup",
                params: {
                    user_id: user_id,
                    code: code
                }
            });
            if (rs.data.result_code == 1) {
                const data = rs.data.result_data;
                const user = {
                    id: data.id,
                    type: data.type_member,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    max_users: data.max_users,
                    joindate: data.joindate
                };
                localStorage.setItem("session_token", data.session_token);
                localStorage.setItem("user", JSON.stringify(user));

                if (data.type_member == 0) {
                    window.location.replace("/admin");
                }
                if (data.type_member == 2) {
                    window.location.replace("/");
                }
                if (data.type_member == 1) {
                    window.location.replace("/company/users");
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
    render() {
        return <p> Đăng đăng nhập...</p>;
    }
}

export default withRouter(AutoLogin);
