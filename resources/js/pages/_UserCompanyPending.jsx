import { Player } from "@lottiefiles/react-lottie-player";
import React, { Component } from "react";
import ChangeItemPerPage from "../components/ChangeItemPerPage";
import Pagination from "../components/Pagination";
import CompanyLayout from "../pageComponents/CompanyLayout";
import SearchBar from "../pageComponents/SearchBar";
import moment from "moment";

import {
    Button,
    FilledInput,
    FormControl,
    InputAdornment,
    InputLabel,
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
    TableBody,
    TablePagination,
    Toolbar,
    makeStyles,
    lighten,
    Menu,
    MenuItem,
    withStyles,
    CircularProgress
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import ContextWrapper from "../context/ContextWrapper";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import GetAppIcon from "@material-ui/icons/GetApp";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
class UserCompanyPending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            tableLoading: false,
            users: [],
            loading: [],

            itemPerPage: 25,
            total: 0,
            totalPage: 0,
            offset: 0
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    componentDidMount() {
        this.fetchUsers();
    }
    fetchUsers() {
        let loadingTemp = [];
        this.setState(
            {
                tableLoading: true
            },
            async () => {
                try {
                    const rs1 = await window.axios.post(window.apiURL, {
                        method: "search_user_invited",
                        params: {
                            session_token: this.props.auth.token,
                            size_page: this.state.itemPerPage,
                            current_page:
                                this.state.offset / this.state.itemPerPage,
                            company_id: this.props.auth.user.id,
                            key: this.state.search
                        }
                    });
                    let copy = rs1.data.result_data.map(e => {
                        const o = Object.assign({}, e);
                        o.sent = false;
                        loadingTemp.push(false);
                        return o;
                    });
                    this.setState({
                        users: copy,
                        total: rs1.data.count,
                        totalPage: Math.ceil(
                            rs1.data.count / this.state.itemPerPage
                        ),
                        tableLoading: false,
                        loading: loadingTemp
                    });
                } catch (error) {
                    this.props.notify.error();
                } finally {
                }
            }
        );
    }

    renderHeader() {
        return (
            <thead>
                <tr>
                    <th className="whitespace-no-wrap px-6 py-3 w-24 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        Email
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        Name
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        Date Invited
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        Total Sent
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                </tr>
            </thead>
        );
    }
    renderBody() {
        const { users, loading } = this.state;

        return users.filter(e => e.status_invite == 0).length > 0 ? (
            users
                .filter(e => e.status_invite == 0)
                .map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                        <td className="text-center">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-no-wrap ">
                            <a
                                className="flex text-blue-600 text-sm font-semibold hover:underline"
                                href={
                                    window.baseURL +
                                    "/company/users/detail/" +
                                    0
                                }
                                target="_blank"
                            >
                                {user.email_invite}
                                <img
                                    src={
                                        window.baseURL +
                                        "/public/images/export.svg"
                                    }
                                    className="w-4 ml-3"
                                />
                            </a>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm ">
                            {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm ">
                            {moment(user.date_invite).format("DD-MM-YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm ">
                            {user.count_time_invite}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm ">
                            {user.sent ? (
                                <Button backgroundColor="bg-gray-900" disabled>
                                    Sent
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => this.sendEmail(user, index)}
                                    loading={loading[index]}
                                >
                                    Re-send
                                </Button>
                            )}
                        </td>
                    </tr>
                ))
        ) : (
            <tr>
                <td
                    colSpan="6"
                    className="text-center px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
                >
                    No data
                </td>
            </tr>
        );
    }
    handleSearch() {
        this.setState(
            {
                offset: 0
            },
            () => {
                this.fetchUsers();
            }
        );
    }
    sendEmail(user, index) {
        const copy = [...this.state.loading];
        copy[index] = true;

        this.setState(
            {
                loading: copy
            },
            async () => {
                try {
                    const rs_invite = await window.axios.post(window.apiURL, {
                        method: "invite_user",
                        params: {
                            session_token: this.props.auth.token,
                            email: user.email_invite,
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
                    this.props.notify.error();
                } finally {
                    const user_copy = [...this.state.users];
                    user_copy[index].sent = true;

                    this.setState({
                        users: user_copy
                    });
                }
            }
        );
    }
    render() {
        const {
            search,
            tableLoading,
            users,
            itemPerPage,
            total,
            totalPage,
            offset
        } = this.state;
        return (
            <div className="w-full ml-64 mr-3 overflow-auto">
                <div className="flex justify-between items-center mx-auto py-6">
                    <h1 className="text-base font-bold leading-tight text-gray-900">
                        Pending Users
                    </h1>
                </div>
                <div className="flex justify-between items-center col-gap-10">
                    <SearchBar
                        value={search}
                        onChange={value => this.setState({ search: value })}
                        handleSearch={this.handleSearch}
                    />
                </div>
                <div className="flex flex-col my-3">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow  border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                {this.renderHeader()}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan="6">
                                                <Player
                                                    autoplay
                                                    loop
                                                    src={
                                                        window.baseURL +
                                                        "/public/images/loading.json"
                                                    }
                                                    style={{
                                                        height: "150px",
                                                        width: "150px"
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        this.renderBody()
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        itemsPerPageComponent={
                            <ChangeItemPerPage
                                itemPerPage={itemPerPage}
                                onClick={(item, state) =>
                                    this.setState(
                                        {
                                            itemPerPage: item
                                        },
                                        this.fetchUsers
                                    )
                                }
                            />
                        }
                        data={users}
                        totalPage={totalPage}
                        total={total}
                        offset={offset}
                        itemsPerPage={itemPerPage}
                        onChange={offset =>
                            this.setState(
                                {
                                    offset: offset
                                },
                                this.fetchUsers
                            )
                        }
                    />
                </div>
            </div>
        );
    }
}

export default ContextWrapper(UserCompanyPending);
