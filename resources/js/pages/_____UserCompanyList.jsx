import React, { Component } from "react";
import CompanyLayout from "../pageComponents/CompanyLayout";
import ContextWrapper from "../context/ContextWrapper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { DataGrid } from "@material-ui/data-grid";
import {
    Box,
    Button,
    Container,
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
    TablePagination
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    {
        field: "max_time",
        headerName: "Max Time",
        type: "number",
        width: 90
    },
    {
        field: "results_count",
        headerName: "Total Submit",
        type: "number",
        width: 90
    },
    {
        field: "updated_at",
        headerName: "Latest Submit",
        valueGetter: row =>
            `${row.updated_at && moment(row.updated_at).format("DD/MM/YYYY")}`
    }
];

class UserCompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            total: 0,
            totalPage: 0,
            tableLoading: false,
            value: 0
        };

        this.fetchUsers = this.fetchUsers.bind(this);
    }

    componentDidMount() {
        this.fetchUsers();
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
                            size_page: 1000000,
                            current_page: 1,
                            company_id: this.props.auth.user.id
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
                        tableLoading: false
                    });
                } catch (error) {
                    this.props.notify.error();
                } finally {
                }
            }
        );
    }
    render() {
        const { value, users } = this.state;
        return (
            <>
                <CompanyLayout />
                <Container className="flex-grow my-10">
                    <div className="flex items-center justify-between mb-10">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab label="Active Member" {...a11yProps(0)} />
                            <Tab label="Pending Member" {...a11yProps(1)} />
                        </Tabs>
                        <Button
                            variant="text"
                            color="primary"
                            startIcon={<AddIcon />}
                        >
                            Invite member
                        </Button>
                    </div>
                    <TabPanel value={value} index={0}>
                        <form onSubmit={event => handleSearch(event)}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="standard-adornment-Search">
                                    Search
                                </InputLabel>
                                <FilledInput
                                    id="standard-adornment-Search"
                                    onChange={event =>
                                        setSearch(event.target.value)
                                    }
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setFilterOpen(!filterOpen)
                                                }
                                            >
                                                <FilterListIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </form>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            pageSize={5}
                            checkboxSelection
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
                    </TabPanel>
                </Container>
            </>
        );
    }
}
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
export default ContextWrapper(UserCompanyList);
