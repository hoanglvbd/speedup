import React, { Component } from "react";
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
    CircularProgress,
    Chip
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import ContextWrapper from "../context/ContextWrapper";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import GetAppIcon from "@material-ui/icons/GetApp";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EmailIcon from "@material-ui/icons/Email";
import CheckIcon from "@material-ui/icons/Check";

const headCells = [
    {
        id: "email_invite",
        numeric: false,
        disablePadding: false,
        label: "Email"
    },
    {
        id: "date_invite",
        numeric: true,
        disablePadding: false,
        label: "Ngày Mời"
    },
    {
        id: "count_time_invite",
        numeric: true,
        disablePadding: false,
        label: "Tổng Lượt Đã Mời"
    },
    {
        id: "status_invite",
        numeric: true,
        disablePadding: false,
        label: "Trạng Thái"
    },
    {
        id: "sent",
        numeric: true,
        disablePadding: false,
        label: ""
    }
];

class UserCompanyPending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderBy: "",
            order: "asc",
            tableLoading: false,
            selected: [],

            itemPerPage: 25,
            total: 0,
            offset: 0,
            search: "",

            users: [],
            showDelete: false,
            deleteLoading: false
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.createSortHandler = this.createSortHandler.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    handleChangePage(event, newPage) {
        this.setState({
            offset: newPage
        });
    }
    handleChangeRowsPerPage(event) {
        this.setState({
            itemPerPage: parseInt(event.target.value),
            offset: 0
        });
    }
    handleSearch(event) {
        event.preventDefault();
        this.fetchUsers();
    }
    renderHeader() {
        const { orderBy, order, selected, users } = this.state;

        return (
            <TableHead>
                <TableRow>
                    {headCells.map(headCell => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                                headCell.disablePadding ? "none" : "default"
                            }
                            sortDirection={
                                orderBy === headCell.id ? order : false
                            }
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : "asc"
                                }
                                onClick={() =>
                                    this.createSortHandler(headCell.id)
                                }
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span
                                        style={{
                                            order: 0,
                                            clip: "rect(0 0 0 0)",
                                            height: 1,
                                            margin: -1,
                                            overflow: "hidden",
                                            padding: 0,
                                            position: "absolute",
                                            top: 20,
                                            width: 1
                                        }}
                                    >
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    renderBody() {
        const {
            users,
            order,
            orderBy,
            offset,
            itemPerPage,
            tableLoading,
            loading
        } = this.state;
        return (
            <TableBody>
                {tableLoading ? (
                    <TableRow>
                        <TableCell align="center" colSpan={6}>
                            <CircularProgress />
                        </TableCell>
                    </TableRow>
                ) : (
                    <>
                        {stableSort(users, getComparator(order, orderBy))
                            .slice(
                                offset * itemPerPage,
                                offset * itemPerPage + itemPerPage
                            )
                            .map((row, index) => {
                                const isItemSelected = this.isSelected(
                                    row.id_invite
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id_invite}
                                        selected={isItemSelected}
                                    >
                                        <TableCell component="th">
                                            {row.email_invite}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.date_invite}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.count_time_invite}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.status_invite == 0 && (
                                                <Chip
                                                    label="Đang Chờ"
                                                    color="default"
                                                />
                                            )}
                                            {row.status_invite == 1 && (
                                                <Chip
                                                    label="Đã Từ Chối"
                                                    color="secondary"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.sent ? (
                                                <Button
                                                    color="default"
                                                    disabled
                                                    variant="contained"
                                                    startIcon={<CheckIcon />}
                                                >
                                                    Sent
                                                </Button>
                                            ) : (
                                                <>
                                                    {loading[index] ? (
                                                        <Button
                                                            disabled
                                                            variant="contained"
                                                            color="default"
                                                            startIcon={
                                                                <CircularProgress
                                                                    size={30}
                                                                />
                                                            }
                                                        ></Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                this.sendEmail(
                                                                    row,
                                                                    index
                                                                )
                                                            }
                                                            color="primary"
                                                            variant="contained"
                                                            startIcon={
                                                                <EmailIcon />
                                                            }
                                                        >
                                                            Mời Lại
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                        {users.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                )}
            </TableBody>
        );
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
                            size_page: 1000000,
                            current_page: 1,
                            company_id: this.props.auth.user.id,
                            key: this.state.search
                        }
                    });
                    let copy = rs1.data.result_data
                        .filter(e => e.status_invite != 2)
                        .map(e => {
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

    sendEmail(row, index) {
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
                            email: row.email_invite,
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

    createSortHandler(property) {
        const isAsc =
            this.state.orderBy === property && this.state.order === "asc";
        this.setState({
            order: isAsc ? "desc" : "asc",
            orderBy: property
        });
    }
    isSelected(name) {
        return this.state.selected.indexOf(name) !== -1;
    }
    handleClick(event, name) {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        this.setState({
            selected: newSelected
        });
    }
    render() {
        const {
            users,
            selected,
            total,
            offset,
            itemPerPage,
            showDelete,
            deleteLoading,
            filterOpen
        } = this.state;
        return (
            <>
                <form onSubmit={this.handleSearch}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="standard-adornment-Search">
                            Tìm Thành Viên
                        </InputLabel>
                        <FilledInput
                            id="standard-adornment-Search"
                            onChange={event =>
                                this.setState({
                                    search: event.target.value
                                })
                            }
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                            /*      endAdornment={
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
                            } */
                        />
                    </FormControl>
                </form>
                <Paper>
                    <RenderToolBar users={users} selected={selected} />
                    <TableContainer>
                        <Table>
                            {this.renderHeader()}
                            {this.renderBody()}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        labelRowsPerPage="Hiển Thị"
                        rowsPerPageOptions={[25, 50, 100, 250]}
                        component="div"
                        count={Math.ceil(total / itemPerPage)}
                        rowsPerPage={itemPerPage}
                        page={offset}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </>
        );
    }
}
const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    highlight:
        theme.palette.type === "light"
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark
              },
    title: {
        flex: "1 1 100%"
    }
}));
const RenderToolBar = props => {
    const { selected, users } = props;
    const classes = useToolbarStyles();
    const numSelected = selected.length;

    const [
        exportSelectedMembersAnchor,
        setExportSelectedMembersAnchor
    ] = React.useState(null);

    const filteredUsers = () => {
        let temp = [];
        selected.forEach(u_id => {
            temp.push(users.find(e => e.id_invite == u_id.id_invite));
        });

        return temp;
    };
    const checkToArray = users => {
        const user_id_array = [];
        users.forEach(e => {
            user_id_array.push({
                id_invite: e.id_invite,
                name: e.name
            });
        });
        return user_id_array;
    };
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <Typography variant="h6" id="tableTitle" component="div">
                {/*  Pending Members */}
            </Typography>
            {/*  {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography variant="h6" id="tableTitle" component="div">
                    Pending Members
                </Typography>
            )}

            {numSelected > 0 ? (
                <div className="flex items-center justify-center">
                    <div></div>
                </div>
            ) : (
                <div></div>
            )} */}
        </Toolbar>
    );
};

/* const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell); */

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export default ContextWrapper(UserCompanyPending);
