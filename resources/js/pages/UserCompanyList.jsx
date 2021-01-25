import React, { Component } from "react";
import Button from "../components/Button";
import CompanyLayout from "../pageComponents/CompanyLayout";
import SearchBar from "../pageComponents/SearchBar";
import Dropdown from "../components/Dropdown";
import CheckBox from "../components/CheckBox";
import { Player } from "@lottiefiles/react-lottie-player";
import ContextWrapper from "../context/ContextWrapper";
import MoreVert from "../components/MoreVert";
import moment from "moment";
import Pagination from "../components/Pagination";
import ChangeItemPerPage from "../components/ChangeItemPerPage";
import StudentAdd from "../pageComponents/StudentAdd";
import DeletePopup from "../components/DeletePopup";

const DELETE_TYPE = {
    MULTIPLE: "MULTIPLE",
    SIGNLE: "SIGNLE"
};
class UserCompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forceRender: 1,
            users: [],
            selectedUsers: [],
            currentUser: {},
            tableLoading: false,
            showModalDelete: false,
            showFilter: false,
            deleteType: DELETE_TYPE.SIGNLE,
            itemPerPage: 25,

            total: 0,
            totalPage: 0,
            offset: 0,

            sort: {
                email: "",
                name: "",
                totalSummit: "",
                date: "desc",
                max_time: ""
            },
            search: "",
            checkAll: false
        };

        this.fetchUsers = this.fetchUsers.bind(this);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.checkToArray = this.checkToArray.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.allExist = this.allExist.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    componentDidMount() {
        this.fetchUsers();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.sort !== this.state.sort) {
            this.fetchUsers();
        }
    }
    fetchUsers() {
        this.setState(
            {
                tableLoading: true
            },
            async () => {
                try {
                    const rs1 = await window.axios.post(window.apiURL, {
                        method: "search_user",
                        params: {
                            session_token: this.props.auth.token,
                            size_page: this.state.itemPerPage,
                            current_page:
                                this.state.offset / this.state.itemPerPage,
                            company_id: this.props.auth.user.id,
                            name: this.state.search
                        }
                    });

                    const rs2 = await window.axios.post(
                        window.baseURL + "/api/get_user",
                        {
                            data: rs1.data.result_data
                        }
                    );
                    this.setState({
                        users: rs2.data.users,
                        total: rs1.data.count,
                        totalPage: Math.ceil(
                            rs1.data.count / this.state.itemPerPage
                        ),
                        checkAll: this.allExist(
                            rs1.data.result_data,
                            this.state.selectedUsers
                        ),
                        tableLoading: false
                    });
                } catch (error) {
                    this.props.notify.error();
                } finally {
                }
            }
        );
    }

    allExist(incoming, selected) {
        let total = 0;
        incoming.forEach(e => {
            if (selected.some(selec => selec.user_id == e.user_id)) {
                total = total + 1;
            }
        });
        if (total == incoming.length) {
            return true;
        }
        return false;
    }

    handleSearch(event) {
        this.setState(
            {
                offset: 0
            },
            () => {
                this.fetchUsers();
            }
        );
    }

    handleChecked(user, value) {
        const { selectedUsers } = this.state;
        let copyOfSelectedUser = [...selectedUsers];
        const exist = selectedUsers.some(e => e.user_id == user.user_id);
        if (!exist) {
            copyOfSelectedUser.push(user);
        } else {
            copyOfSelectedUser = copyOfSelectedUser.filter(
                e => e.user_id !== user.user_id
            );
        }

        this.setState({
            selectedUsers: copyOfSelectedUser
        });
    }

    checkToArray() {
        const temp = this.state.selectedUsers;
        const user_id_array = [];
        temp.forEach(e => {
            user_id_array.push(e.user_id);
        });
        return user_id_array;
    }

    handleCheckAll() {
        const { users, selectedUsers } = this.state;
        let copyOfSelectedUser = [...selectedUsers];

        let exist =
            selectedUsers.some(r => users.includes(r)) ||
            this.allExist(users, selectedUsers);
        if (exist) {
            users.forEach(element => {
                copyOfSelectedUser = copyOfSelectedUser.filter(
                    e => e.user_id !== element.user_id
                );
            });

            this.setState({
                selectedUsers: copyOfSelectedUser,
                checkAll: false
            });
        } else {
            users.forEach(element => {
                copyOfSelectedUser.push(element);
            });

            this.setState({
                selectedUsers: copyOfSelectedUser,
                checkAll: true
            });
        }
    }

    async handleDelete() {
        const { currentUser, deleteType, forceRender } = this.state;
        try {
            const rs = await window.axios.delete(
                window.baseURL + "/company/users?id=",
                {
                    params: {
                        id:
                            deleteType === DELETE_TYPE.SIGNLE
                                ? currentUser.id
                                : JSON.stringify(this.checkToArray()),
                        type: deleteType
                    }
                }
            );
            if (rs.data.statusCode == 200) {
                this.setState({
                    showModalDelete: false,
                    selectedUsers: [],
                    forceRender: forceRender + 1
                });
                this.fetchUsers();
                this.props.notify.success("Delete successfully");
            }
        } catch (error) {
            this.props.notify.error();
        } finally {
        }
    }
    render() {
        const {
            forceRender,
            showModalDelete,
            tableLoading,
            showFilter,
            users,
            selectedUsers,
            itemPerPage,
            total,
            totalPage,
            offset,
            sort,
            search,
            checkAll
        } = this.state;
        return (
            <CompanyLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="flex justify-between items-center mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Users Management
                        </h1>
                    </div>
                    <div className="flex justify-between items-center col-gap-10">
                        <SearchBar
                            value={search}
                            onChange={value => this.setState({ search: value })}
                            handleSearch={this.handleSearch}
                        />
                    </div>
                    <div className="flex justify-between mt-3">
                        <div>
                            <div
                                className="bg-white px-3 text-xs py-1 cursor-pointer flex items-center rounded-full border"
                                onClick={() =>
                                    this.setState({
                                        showFilter: !showFilter
                                    })
                                }
                            >
                                <img
                                    src={
                                        window.baseURL +
                                        "/public/images/filter.svg"
                                    }
                                    className="w-3 mr-2"
                                />
                                Filter
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col my-3">
                        <div
                            className={
                                (selectedUsers.length > 0
                                    ? " opacity-100"
                                    : " opacity-25") +
                                " bg-purple-200 flex justify-between p-3 mb-3 items-center rounded font-semibold text-main"
                            }
                        >
                            <div className="flex items-center">
                                <div>{selectedUsers.length} users seleted</div>
                                {selectedUsers.length > 0 && (
                                    <div className="flex items-center ml-6">
                                        <button
                                            onClick={() => {
                                                this.setState({
                                                    selectedUsers: [],
                                                    checkAll: false
                                                });
                                            }}
                                            className="outline-none shadow-none bg-gray-600 rounded-xl flex items-center px-4"
                                        >
                                            <img
                                                src={
                                                    window.baseURL +
                                                    "/public/images/cancel.svg"
                                                }
                                                className="w-3 mr-3"
                                            />
                                            <div className="text-white font-semibold">
                                                Clear
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <Dropdown
                                    disabled={selectedUsers.length == 0}
                                    text="Download"
                                    bgColor=" bg-blue-600 "
                                    textColor=" text-white "
                                    icon={
                                        <img
                                            src={
                                                window.baseURL +
                                                "/public/images/download.svg"
                                            }
                                            width="15px"
                                            className="mr-3"
                                        />
                                    }
                                >
                                    <a
                                        href={
                                            window.baseURL +
                                            "/api/export/summaryExcel?num=1&user_id=" +
                                            this.checkToArray()
                                        }
                                        className={
                                            (selectedUsers.some(
                                                r => r.results_count >= 1
                                            )
                                                ? ""
                                                : " cursor-not-allowed opacity-50") +
                                            " hover:bg-gray-300 block  whitespace-no-wrap items-center justify-center px-4 py-1 border border-transparent text-sm leading-6 font-medium transition ease-in-out duration-150 w-full text-left"
                                        }
                                        title={
                                            selectedUsers.some(
                                                r => r.results_count >= 1
                                            )
                                                ? ""
                                                : "None of selected users has data"
                                        }
                                    >
                                        Download Summary Result No. 1
                                    </a>
                                    <a
                                        href={
                                            window.baseURL +
                                            "/api/export/summaryExcel?num=2&user_id=" +
                                            this.checkToArray()
                                        }
                                        className={
                                            (selectedUsers.some(
                                                r => r.results_count == 2
                                            )
                                                ? ""
                                                : " cursor-not-allowed opacity-50") +
                                            " hover:bg-gray-300 block  whitespace-no-wrap items-center justify-center px-4 py-1 border border-transparent text-sm leading-6 font-medium transition ease-in-out duration-150 w-full text-left"
                                        }
                                        title={
                                            selectedUsers.some(
                                                r => r.results_count == 2
                                            )
                                                ? ""
                                                : "None of selected users has results No.2"
                                        }
                                    >
                                        Download Summary Result No. 2
                                    </a>
                                </Dropdown>
                                <div className="mx-3">
                                    <Button
                                        disabled={selectedUsers.length == 0}
                                        onClick={() =>
                                            this.setState({
                                                showModalDelete: true,
                                                deleteType: DELETE_TYPE.MULTIPLE
                                            })
                                        }
                                        backgroundColor="bg-red-700"
                                        textColor=""
                                    >
                                        <img
                                            src={
                                                window.baseURL +
                                                "/public/images/trash.svg"
                                            }
                                            width="15px"
                                            className="mr-3"
                                        />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="py-2 align-middle inline-block min-w-full">
                                <div className="shadow  border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 ">
                                        {this.renderHeader()}
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tableLoading ? (
                                                <tr>
                                                    <td colSpan="7">
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
                    {showModalDelete && (
                        <DeletePopup
                            onCancle={() =>
                                this.setState({ showModalDelete: false })
                            }
                            onDelete={this.handleDelete}
                        />
                    )}
                </div>
            </CompanyLayout>
        );
    }

    renderHeader() {
        const { checkAll, sort } = this.state;
        return (
            <thead>
                <tr>
                    <th className="whitespace-no-wrap w-12 bg-gray-800">
                        <CheckBox
                            id="check_all"
                            checked={checkAll}
                            onChange={this.handleCheckAll}
                        />
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                setState({
                                    username:
                                        sort.username === "desc"
                                            ? "asc"
                                            : "desc",
                                    name: "",
                                    totalSummit: "",
                                    date: "",
                                    max_time: ""
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Email
                            {sort.username !== "" &&
                                (sort.username == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                setState({
                                    username: "",
                                    name: sort.name === "desc" ? "asc" : "desc",
                                    totalSummit: "",
                                    date: "",
                                    max_time: ""
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Name
                            {sort.name !== "" &&
                                (sort.name == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>

                    <th className="whitespace-no-wrap px-6 py-3 w-40 bg-gray-800  text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                setState({
                                    username: "",
                                    totalSummit: "",
                                    max_time:
                                        sort.max_time === "desc"
                                            ? "asc"
                                            : "desc",
                                    name: "",
                                    date: ""
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Maximum allowed submit
                            {sort.max_time !== "" &&
                                (sort.max_time == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 w-40 bg-gray-800  text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                setState({
                                    username: "",
                                    totalSummit:
                                        sort.totalSummit === "desc"
                                            ? "asc"
                                            : "desc",
                                    name: "",
                                    date: "",
                                    max_time: ""
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Total Submitted
                            {sort.totalSummit !== "" &&
                                (sort.totalSummit == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 w-40 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                setState({
                                    username: "",
                                    name: "",
                                    totalSummit: "",
                                    date: sort.date === "desc" ? "asc" : "desc",
                                    max_time: ""
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Lastest Submitted
                            {sort.date !== "" &&
                                (sort.date == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-800 w-16"></th>
                </tr>
            </thead>
        );
    }

    renderBody() {
        const { users, selectedUsers } = this.state;
        return users.length > 0 ? (
            users.map(user => (
                <tr key={user.user_id} className="hover:bg-gray-100">
                    <td className="text-center">
                        <CheckBox
                            id={"check_" + user.user_id}
                            checked={selectedUsers.some(
                                e => e.user_id == user.user_id
                            )}
                            onChange={event =>
                                this.handleChecked(user, event.target.checked)
                            }
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap ">
                        <a
                            className="flex text-blue-600 text-sm font-semibold hover:underline"
                            href={
                                window.baseURL +
                                "/company/users/detail/" +
                                user.user_id
                            }
                            target="_blank"
                        >
                            {user.email}
                            <img
                                src={
                                    window.baseURL + "/public/images/export.svg"
                                }
                                className="w-4 ml-3"
                            />
                        </a>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-900">
                            {user.name}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-center">
                        {user.max_time}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-center">
                        {user.results_count}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                        {user.updated_at &&
                            moment(user.updated_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-2 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium flex items-center justify-center">
                        <MoreVert>
                            <a
                                href={
                                    window.baseURL +
                                    "/admin/export/exportselectedinfo?user_id=" +
                                    user.id
                                }
                                className="text-left border-b p-3  text-sm "
                            >
                                Download Infomation
                            </a>
                            <a
                                href={
                                    window.baseURL +
                                    "/admin/export/exportselectedrawresult?user_id=" +
                                    user.id
                                }
                                className="text-left border-b p-3  text-sm "
                            >
                                Download Raw Results
                            </a>
                            <button
                                onClick={() => {
                                    this.setState({
                                        currentUser: user,
                                        showModalDelete: true,
                                        deleteType: DELETE_TYPE.SIGNLE
                                    });
                                }}
                                className="text-left text-red-600 p-3 text-sm font-semibold   hover:text-red-900"
                            >
                                Delete
                            </button>
                        </MoreVert>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td
                    colSpan="7"
                    className="text-center px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
                >
                    No data
                </td>
            </tr>
        );
    }
}

export default ContextWrapper(UserCompanyList);
const DescIcon = () => {
    return (
        <img
            src={window.baseURL + "/public/images/arrow-down.svg"}
            className="w-4 ml-3"
        />
    );
};

const AscIcon = () => {
    return (
        <img
            src={window.baseURL + "/public/images/arrow-down.svg"}
            className="w-4 ml-3 transform rotate-180"
        />
    );
};
