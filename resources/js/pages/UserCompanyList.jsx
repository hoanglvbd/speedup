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
    CircularProgress
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

const headCells = [
    { id: "name_invited", numeric: false, disablePadding: true, label: "Name" },
    {
        id: "email_invited",
        numeric: false,
        disablePadding: true,
        label: "Email"
    },
    {
        id: "max_submit",
        numeric: true,
        disablePadding: false,
        label: "Max Time"
    },
    {
        id: "results_count",
        numeric: true,
        disablePadding: false,
        label: "Total Submit"
    },
    {
        id: "updated_at",
        numeric: true,
        disablePadding: false,
        label: "Latest Submit"
    }
];

class UserCompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
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
        this.handleChange = this.handleChange.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.createSortHandler = this.createSortHandler.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
                        method: "search_employer",
                        params: {
                            session_token: this.props.auth.token,
                            size_page: 1000000,
                            current_page: 1,
                            company_id: this.props.auth.user.id,
                            key: this.state.search
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
    handleChange(event, newValue) {
        this.setState({
            value: newValue
        });
    }
    createSortHandler(property) {
        const isAsc =
            this.state.orderBy === property && this.state.order === "asc";
        this.setState({
            order: isAsc ? "desc" : "asc",
            orderBy: property
        });
    }
    handleChangePage(event, newPage) {
        this.setState({
            offset: newPage
        });
    }
    handleChangeRowsPerPage(event) {
        console.log(event.target.value);
        this.setState({
            itemPerPage: parseInt(event.target.value),
            offset: 0
        });
    }
    exportMembers(num, data) {
        window.axios
            .post(window.baseURL + "/api/export/summaryExcel", {
                num: num,
                data: data
            })
            .then(rs => {
                if (num == 1) {
                    window.open(window.baseURL + "/Summary_result_No_1.xlsx");
                } else {
                    window.open(window.baseURL + "/Summary_result_No_1_2.xlsx");
                }
            });
    }
    handleSearch(event) {
        event.preventDefault();
        this.fetchUsers();
    }
    handleDelete() {
        this.setState(
            {
                deleteLoading: true
            },
            async () => {
                try {
                    const rs = await window.axios.post(window.apiURL, {
                        method: "remove_user",
                        params: {
                            session_token: this.props.auth.token,
                            user_id: this.state.selected.join(),
                            company_id: this.props.auth.user.id
                        }
                    });

                    this.props.notify.success("Remove successfully!");
                    this.setState({
                        showDelete: false
                    });
                    this.fetchUsers();
                } catch (error) {
                    this.props.notify.error();
                } finally {
                    this.setState({
                        deleteLoading: false
                    });
                }
            }
        );
    }
    render() {
        const {
            value,
            users,
            selected,
            total,
            offset,
            itemPerPage,
            showDelete,
            deleteLoading
        } = this.state;
        return (
            <>
                <form onSubmit={this.handleSearch}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="standard-adornment-Search">
                            Search
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
                            /* endAdornment={
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
                <Paper elevation={3}>
                    <RenderToolBar
                        exportMembers={this.exportMembers}
                        users={users}
                        selected={selected}
                        setShowDialog={status => {
                            this.setState({
                                showDelete: status
                            });
                        }}
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            {this.renderHeader()}
                            {this.renderBody()}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 100, 250]}
                        component="div"
                        count={Math.ceil(total / itemPerPage)}
                        rowsPerPage={itemPerPage}
                        page={offset}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                <Dialog
                    open={showDelete}
                    onClose={() =>
                        this.setState({
                            showDelete: false
                        })
                    }
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {deleteLoading && (
                        <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-center z-50">
                            <div className="absolute right-0 left-0 top-0 bottom-0 bg-white opacity-50" />
                            <CircularProgress />
                        </div>
                    )}

                    <DialogTitle id="alert-dialog-title">
                        {"Remove member from your company?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This action cannot be undone!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                this.setState({
                                    showDelete: false
                                })
                            }
                            color="primary"
                        >
                            Disagree
                        </Button>
                        <Button
                            onClick={() => this.handleDelete()}
                            color="secondary"
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
    handleSelectAllClick(event) {
        const { users } = this.state;
        if (event.target.checked) {
            const newSelecteds = users.map(n => n.emp_id_invited);
            this.setState({
                selected: newSelecteds
            });
            return;
        }
        this.setState({
            selected: []
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

    renderHeader() {
        const { orderBy, order, selected, users } = this.state;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={
                                selected.length > 0 &&
                                selected.length < users.length
                            }
                            checked={
                                users.length > 0 &&
                                selected.length === users.length
                            }
                            onChange={this.handleSelectAllClick}
                            inputProps={{
                                "aria-label": "select all desserts"
                            }}
                        />
                    </TableCell>

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
            tableLoading
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
                                    row.emp_id_invited
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={event =>
                                            this.handleClick(
                                                event,
                                                row.emp_id_invited
                                            )
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.name_invited}
                                        </TableCell>
                                        <TableCell>
                                            {row.email_invited}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.max_time}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.results_count}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.updated_at &&
                                                moment(row.updated_at).format(
                                                    "DD/MM/YYYY"
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
    const { selected, exportMembers, users, setShowDialog } = props;
    const classes = useToolbarStyles();
    const numSelected = selected.length;
    const [exportAllMembersAnchor, setExportAllMembersAnchor] = React.useState(
        null
    );
    const [
        exportSelectedMembersAnchor,
        setExportSelectedMembersAnchor
    ] = React.useState(null);

    const filteredUsers = () => {
        let temp = [];
        selected.forEach(u_id => {
            temp.push(users.find(e => e.emp_id_invited == u_id));
        });

        return temp;
    };
    const checkToArray = users => {
        const user_id_array = [];
        users.forEach(e => {
            user_id_array.push({
                emp_id_invited: e.emp_id_invited,
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
            {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography variant="h6" id="tableTitle" component="div">
                    Active Members
                </Typography>
            )}

            {numSelected > 0 ? (
                <div className="flex items-center justify-center">
                    <div>
                        <div>
                            <Tooltip title="Export selected members">
                                <IconButton
                                    variant="text"
                                    color="primary"
                                    aria-controls="exportSelectedMembers"
                                    aria-haspopup="true"
                                    onClick={event => {
                                        setExportSelectedMembersAnchor(
                                            event.currentTarget
                                        );
                                    }}
                                >
                                    <GetAppIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="exportSelectedMembers"
                                anchorEl={exportSelectedMembersAnchor}
                                keepMounted
                                open={Boolean(exportSelectedMembersAnchor)}
                                onClose={() => {
                                    setExportSelectedMembersAnchor(null);
                                }}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center"
                                }}
                                getContentAnchorEl={null}
                            >
                                <MenuItem
                                    disabled={
                                        !filteredUsers().some(
                                            r => r.results_count >= 1
                                        )
                                    }
                                    onClick={() => {
                                        filteredUsers(
                                            1,
                                            checkToArray(filteredUsers())
                                        );
                                    }}
                                >
                                    Export No.1
                                </MenuItem>
                                <MenuItem
                                    disabled={
                                        !filteredUsers().some(
                                            r => r.results_count >= 2
                                        )
                                    }
                                    onClick={() => {
                                        filteredUsers(
                                            2,
                                            checkToArray(filteredUsers())
                                        );
                                    }}
                                >
                                    Export No.2
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <Tooltip title="Remove member">
                        <IconButton
                            variant="text"
                            color="secondary"
                            onClick={() => setShowDialog(true)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : (
                <div>
                    <Tooltip title="Export all members">
                        <IconButton
                            variant="text"
                            color="primary"
                            aria-controls="exportAllMembers"
                            aria-haspopup="true"
                            onClick={event => {
                                setExportAllMembersAnchor(event.currentTarget);
                            }}
                        >
                            <GetAppIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="exportAllMembers"
                        anchorEl={exportAllMembersAnchor}
                        keepMounted
                        open={Boolean(exportAllMembersAnchor)}
                        onClose={() => {
                            setExportAllMembersAnchor(null);
                        }}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center"
                        }}
                        getContentAnchorEl={null}
                    >
                        <MenuItem
                            disabled={!users.some(r => r.results_count >= 1)}
                            onClick={() => {
                                exportMembers(1, checkToArray(users));
                            }}
                        >
                            Export No.1
                        </MenuItem>
                        <MenuItem
                            disabled={!users.some(r => r.results_count >= 2)}
                            onClick={() => {
                                exportMembers(2, checkToArray(users));
                            }}
                        >
                            Export No.2
                        </MenuItem>
                    </Menu>
                </div>
            )}
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

export default ContextWrapper(UserCompanyList);
