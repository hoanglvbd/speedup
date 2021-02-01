import { Player } from "@lottiefiles/react-lottie-player";
import React, { Component } from "react";
import CheckBox from "../components/CheckBox";
import Dropdown from "../components/Dropdown";
import ContextWrapper from "../context/ContextWrapper";
import SearchBar from "../pageComponents/SearchBar";
import SupperAdminLayout from "../pageComponents/SupperAdminLayout";
import moment from "moment";
import Button from "../components/Button";
import Select from "react-select";
import { Collapse } from "react-collapse";
import Input from "../components/Input";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import Pagination from "../components/Pagination";
import ChangeItemPerPage from "../components/ChangeItemPerPage";
class SupperAdminUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUsers: [],
            company: {},
            checkAll: false,
            tableLoading: false,
            search: "",
            company_search: "",
            sort: {
                email: "",
                name: "",
                company: "",
                totalSummit: "",
                date: "desc",
                max_time: ""
            },
            itemPerPage: 25,
            total: 0,
            totalPage: 0,
            offset: 0,

            company_filter_itemPerPage: 25,
            company_filter_total: 0,
            company_filter_totalPage: 0,
            company_filter_offset: 0,

            companiesOptions: [],
            showCompanyOption: false,
            companyFilterLoading: false,
            showFilter: false,

            num_0: true,
            num_1: true,
            num_2: true
        };
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.allExist = this.allExist.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.downloadExcel = this.downloadExcel.bind(this);
        this.downloadRaw = this.downloadRaw.bind(this);
        this.checkToArray = this.checkToArray.bind(this);
        this.handleSearchCompany = this.handleSearchCompany.bind(this);
    }
    componentDidMount() {
        this.fetchUsers();
    }
    checkToArray() {
        const temp = this.state.selectedUsers;
        const user_id_array = [];
        temp.forEach(e => {
            user_id_array.push({
                user_id: e.user_id,
                name: e.name
            });
        });
        return user_id_array;
    }

    componentDidUpdate(prevProps, prevState) {
        const { sort, users } = this.state;
        if (prevState.sort !== sort) {
            const Copy = [...users];
            if (sort.email !== "") {
                if (sort.email == "asc") {
                    Copy.sort((a, b) => a.email.localeCompare(b.email));
                } else {
                    Copy.sort((a, b) => b.email.localeCompare(a.email));
                }
            }
            if (sort.name !== "") {
                if (sort.name == "asc") {
                    Copy.sort((a, b) => a.name.localeCompare(b.name));
                } else {
                    Copy.sort((a, b) => b.name.localeCompare(a.name));
                }
            }
            if (sort.max_users !== "") {
                if (sort.max_users == "asc") {
                    Copy.sort((a, b) => a.max_users - b.max_users);
                } else {
                    Copy.sort((a, b) => b.max_users - a.max_users);
                }
            }
            /*  if (sort.company !== "") {
                if (sort.company == "asc") {
                    Copy.sort((a, b) => a.company.localeCompare(b.company));
                } else {
                    Copy.sort((a, b) => b.company.localeCompare(a.company));
                }
            } */
            if (sort.max_time !== "") {
                if (sort.max_time == "asc") {
                    Copy.sort((a, b) => a.max_time - b.max_time);
                } else {
                    Copy.sort((a, b) => b.max_time - a.max_time);
                }
            }
            if (sort.totalSummit !== "") {
                if (sort.totalSummit == "asc") {
                    Copy.sort((a, b) => a.results_count - b.results_count);
                } else {
                    Copy.sort((a, b) => b.results_count - a.results_count);
                }
            }

            this.setState({
                users: Copy
            });
        }
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
    handleSearchCompany() {
        this.setState(
            {
                showCompanyOption: true,
                companyFilterLoading: true
            },
            async () => {
                const rs = await window.axios.post(window.apiURL, {
                    method: "search_company",
                    params: {
                        session_token: this.props.auth.token,
                        size_page: this.state.company_filter_itemPerPage,
                        current_page:
                            this.state.company_filter_offset /
                            this.state.company_filter_itemPerPage,

                        key: this.state.company_search.trim()
                    }
                });

                this.setState({
                    companiesOptions: rs.data.result_data,
                    companyFilterLoading: false,
                    company_filter_total: rs.data.count,
                    company_filter_totalPage: Math.ceil(
                        rs.data.count / this.state.company_filter_itemPerPage
                    )
                });
            }
        );
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
                            company_id: this.state.company.value,
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
        if (total == incoming.length && total !== 0) {
            return true;
        }
        return false;
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
                                this.setState({
                                    sort: {
                                        email:
                                            sort.email === "desc"
                                                ? "asc"
                                                : "desc",
                                        name: "",
                                        company: "",
                                        totalSummit: "",
                                        date: "",
                                        max_time: ""
                                    }
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Email
                            {sort.email !== "" &&
                                (sort.email == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                this.setState({
                                    sort: {
                                        email: "",
                                        name:
                                            sort.name === "desc"
                                                ? "asc"
                                                : "desc",
                                        totalSummit: "",
                                        company: "",
                                        date: "",
                                        max_time: ""
                                    }
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
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                this.setState({
                                    sort: {
                                        company:
                                            sort.company === "desc"
                                                ? "asc"
                                                : "desc",
                                        email: "",

                                        name: "",
                                        totalSummit: "",
                                        date: "",
                                        max_time: ""
                                    }
                                });
                            }}
                            className="flex items-center cursor-pointer"
                        >
                            Company
                            {sort.company !== "" &&
                                (sort.company == "desc" ? (
                                    <DescIcon />
                                ) : (
                                    <AscIcon />
                                ))}
                        </div>
                    </th>
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                this.setState({
                                    sort: {
                                        company: "",
                                        email: "",
                                        totalSummit: "",
                                        max_time:
                                            sort.max_time === "desc"
                                                ? "asc"
                                                : "desc",
                                        name: "",
                                        date: ""
                                    }
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
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                        <div
                            onClick={() => {
                                this.setState({
                                    sort: {
                                        company: "",
                                        email: "",
                                        totalSummit:
                                            sort.totalSummit === "desc"
                                                ? "asc"
                                                : "desc",
                                        name: "",
                                        date: "",
                                        max_time: ""
                                    }
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
                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 w-16"></th>
                </tr>
            </thead>
        );
    }

    downloadExcel(num) {
        window.axios
            .post(window.baseURL + "/api/export/summaryExcel", {
                num: num,
                data: this.checkToArray()
            })
            .then(rs => {
                if (num == 1) {
                    window.open(window.baseURL + "/Summary_result_No_1.xlsx");
                } else {
                    window.open(window.baseURL + "/Summary_result_No_1_2.xlsx");
                }
            });
    }
    downloadRaw() {
        window.axios
            .post(window.baseURL + "/api/export/exportraw", {
                data: this.checkToArray(),
                auth: this.props.auth.user
            })
            .then(rs => {
                window.open(window.baseURL + "/Summary_Raw_Result.zip");
            });
    }
    renderBody() {
        const { users, selectedUsers } = this.state;
        return users.length > 0 ? (
            users.map((user, index) => (
                <tr
                    key={user.user_id + "" + index}
                    className="hover:bg-gray-100"
                >
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
                                "/company/users/" +
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
                    <td className="px-6 py-4 whitespace-no-wrap text-sm">
                        {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm">
                        "company Name"
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-center">
                        {user.max_time}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-center">
                        {user.results_count}
                    </td>

                    <td className="px-2 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium flex items-center justify-center"></td>
                </tr>
            ))
        ) : (
            <tr>
                <td
                    colSpan="8"
                    className="text-center px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
                >
                    No data
                </td>
            </tr>
        );
    }
    render() {
        const {
            users,
            selectedUsers,
            checkAll,
            tableLoading,
            search,
            company,
            companiesOptions,
            showFilter,
            company_search,
            showCompanyOption,
            companyFilterLoading,
            company_filter_itemPerPage,
            company_filter_total,
            company_filter_totalPage,
            company_filter_offset,
            itemPerPage,
            total,
            totalPage,
            offset,
            num_0,
            num_1,
            num_2
        } = this.state;
        return (
            <SupperAdminLayout>
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
                    {/*        <div className="flex justify-start mt-3">
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
                    </div> */}
                    <Collapse isOpened={showFilter}>
                        <div className="pb-3 border shadow my-6">
                            <div className="flex flex-wrap mt-3">
                                <div className="w-4/12 px-3">
                                    <label
                                        id="listbox-label"
                                        className="mb-3 block text-sm leading-5 font-medium text-gray-700"
                                    >
                                        By Organization
                                    </label>
                                    <div className="relative">
                                        <span className="inline-block w-full rounded-md shadow-sm">
                                            <SearchBar
                                                value={company_search}
                                                placehoder="Search company name"
                                                onChange={value =>
                                                    this.setState({
                                                        company_search: value
                                                    })
                                                }
                                                handleSearch={
                                                    this.handleSearchCompany
                                                }
                                            />
                                            {/* <Select
                                                options={companiesOptions}
                                                value={company}
                                                onChange={e =>
                                                    this.setState({
                                                        company: e
                                                    })
                                                }
                                            /> */}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-4/12 px-3 flex flex-col justify-between">
                                    <label
                                        id="listbox-label"
                                        className="mb-3 block text-sm leading-5 font-medium text-gray-700"
                                    >
                                        By Time
                                    </label>
                                    <div className="flex items-center">
                                        <div className="relative flex items-center">
                                            <CheckBox
                                                id="number_0"
                                                value={num_0}
                                                checked={num_0}
                                                onChange={() =>
                                                    this.setState({
                                                        num_0: !num_0
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="number_0"
                                                className="ml-2 block leading-5 text-gray-900 font-semibold"
                                            >
                                                0
                                            </label>
                                        </div>
                                        <div className="relative flex items-center ml-6">
                                            <CheckBox
                                                id="number_1"
                                                value={num_1}
                                                checked={num_1}
                                                onChange={() =>
                                                    this.setState({
                                                        num_1: !num_1
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="number_1"
                                                className="ml-2 block leading-5 text-gray-900  font-semibold"
                                            >
                                                1
                                            </label>
                                        </div>
                                        <div className="relative flex items-center ml-6">
                                            <CheckBox
                                                id="number_2"
                                                value={num_2}
                                                checked={num_2}
                                                onChange={() =>
                                                    this.setState({
                                                        num_2: !num_2
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor="number_2"
                                                className="ml-2 block leading-5 text-gray-900 font-semibold"
                                            >
                                                2
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Collapse isOpened={showCompanyOption}>
                                <div className="flex flex-col border p-3 m-3">
                                    {companyFilterLoading ? (
                                        <Player
                                            autoplay
                                            loop
                                            src={
                                                window.baseURL +
                                                "/public/images/loading.json"
                                            }
                                            style={{
                                                height: "100px",
                                                width: "100px"
                                            }}
                                        />
                                    ) : companiesOptions.length > 0 ? (
                                        <>
                                            {companiesOptions.map(company => (
                                                <div
                                                    className="flex justify-start items-center"
                                                    key={company.id}
                                                >
                                                    <FormControlLabel
                                                        value="top"
                                                        control={
                                                            <Checkbox color="primary" />
                                                        }
                                                        label={
                                                            company.company_name
                                                        }
                                                        labelPlacement="end"
                                                    />
                                                </div>
                                            ))}
                                            <Pagination
                                                mb="mb-0"
                                                itemsPerPageComponent={
                                                    <ChangeItemPerPage
                                                        itemPerPage={
                                                            company_filter_itemPerPage
                                                        }
                                                        onClick={(
                                                            item,
                                                            state
                                                        ) =>
                                                            this.setState(
                                                                {
                                                                    company_filter_itemPerPage: item
                                                                },
                                                                this
                                                                    .handleSearchCompany
                                                            )
                                                        }
                                                    />
                                                }
                                                data={companiesOptions}
                                                totalPage={
                                                    company_filter_totalPage
                                                }
                                                total={company_filter_total}
                                                offset={company_filter_offset}
                                                itemsPerPage={
                                                    company_filter_itemPerPage
                                                }
                                                onChange={offset =>
                                                    this.setState(
                                                        {
                                                            company_filter_offset: offset
                                                        },
                                                        this.handleSearchCompany
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-700">
                                            No data
                                        </div>
                                    )}
                                </div>
                            </Collapse>
                        </div>
                        <div className="p-3">
                            <Button
                                onClick={() => {
                                    this.setState(
                                        {
                                            offset: 0,
                                            selectedUsers: [],
                                            checkAll: false
                                        },
                                        this.fetchUsers
                                    );
                                }}
                            >
                                Apply Filter
                            </Button>
                        </div>
                    </Collapse>

                    <div className="flex flex-col my-3"></div>
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
                                <button
                                    onClick={() => this.downloadExcel(1)}
                                    disabled={
                                        !selectedUsers.some(
                                            r => r.results_count >= 1
                                        )
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
                                </button>
                                <button
                                    onClick={() => this.downloadExcel(2)}
                                    disabled={
                                        !selectedUsers.some(
                                            r => r.results_count >= 2
                                        )
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
                                </button>
                                <button
                                    disabled={
                                        !selectedUsers.some(
                                            r => r.results_count >= 1
                                        )
                                    }
                                    onClick={() => this.downloadRaw()}
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
                                            : "None of selected users has results No.2"
                                    }
                                >
                                    Download Raw Result
                                </button>
                            </Dropdown>
                            <div className="mx-3">
                                {/* <Button
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
                                        Remove member
                                    </Button> */}
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
                                                <td colSpan="8">
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
            </SupperAdminLayout>
        );
    }
}

export default ContextWrapper(SupperAdminUsers);
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
