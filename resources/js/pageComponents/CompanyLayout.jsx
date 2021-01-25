import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Link, withRouter } from "react-router-dom";

class CompanyLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUsers: false
        };
    }
    render() {
        const { showUsers } = this.state;
        return (
            <>
                <nav className="w-48 fixed left-0 bg-white border-gray-100 shadow h-full flex flex-col p-3">
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
                                "/company/users/list"
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
                                "/company/users/list"
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
                                Create Users
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
                                List Users
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
                </main>
            </>
        );
    }
}

export default withRouter(CompanyLayout);
