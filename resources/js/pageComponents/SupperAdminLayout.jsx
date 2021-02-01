import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Link, withRouter } from "react-router-dom";

class SupperAdminLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showQuestions: false
        };
    }
    render() {
        const { showQuestions } = this.state;
        return (
            <>
                <nav className="w-48 fixed left-0 bg-white border-gray-100 shadow h-full flex flex-col p-3">
                    <Link to={"/admin"} className="text-main flex items-center">
                        <img
                            className="w-24 mb-6"
                            src={window.baseURL + "/public/images/logo.png"}
                            alt="Workflow logo"
                        />
                    </Link>
                    <div
                        onClick={() => {
                            this.setState({
                                showQuestions: !showQuestions
                            });
                        }}
                        className={
                            (this.props.location.pathname == "/admin/questions"
                                ? "active"
                                : "") + " navbar cursor-pointer"
                        }
                    >
                        Questions
                    </div>
                    <Collapse
                        isOpened={
                            showQuestions ||
                            this.props.location.pathname ==
                                "/admin/questions/speedup"
                        }
                    >
                        <Link
                            to={"/admin/questions/speedup"}
                            className={
                                (this.props.location.pathname ==
                                "/admin/questions/speedup"
                                    ? "active"
                                    : "") + " navbar ml-3"
                            }
                        >
                            Speed Up
                        </Link>
                    </Collapse>
                    <Link
                        to={"/admin/company"}
                        className={
                            (this.props.location.pathname == "/admin/company"
                                ? "active"
                                : "") + " navbar"
                        }
                    >
                        Company
                    </Link>
                    <Link
                        to={"/admin/users"}
                        className={
                            (this.props.location.pathname == "/admin/users"
                                ? "active"
                                : "") + " navbar"
                        }
                    >
                        Users
                    </Link>
                    <Link
                        to={"/admin/translation"}
                        className={
                            (this.props.location.pathname ==
                            "/admin/translation"
                                ? "active"
                                : "") + " navbar"
                        }
                    >
                        Translation
                    </Link>
                    <hr />

                    <a
                        href={window.baseURL + "/logout"}
                        className={" navbar text-red-600"}
                    >
                        Logout
                    </a>
                </nav>
                <main className="h-full flex gap-6">{this.props.children}</main>
            </>
        );
    }
}

export default withRouter(SupperAdminLayout);
