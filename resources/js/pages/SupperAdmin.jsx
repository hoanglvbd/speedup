import React, { Component } from "react";
import SupperAdminLayout from "../pageComponents/SupperAdminLayout";
import SearchBar from "../pageComponents/SearchBar";
import Button from "../components/Button";
import { Player } from "@lottiefiles/react-lottie-player";
import moment from "moment";
import NotifyPopup from "../components/NotifyPopup";
import Pagination from "../components/Pagination";
import ChangeItemPerPage from "../components/ChangeItemPerPage";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import AppError from "../components/AppError";
import ModalContainer from "../components/ModalContaner";
import ContextWrapper from "../context/ContextWrapper";
import DeletePopup from "../components/DeletePopup";
import { Collapse } from "react-collapse";
import AppDatePicker from "../components/AppDatePicker";

const company_nameSchema = Yup.object({
    name: Yup.string().required("Company name is required"),
    email: Yup.string()
        .required("Company email is required")
        .email("Invalid email format"),
    max_users: Yup.number()
        .typeError("Must be a number")
        .required("Cannnot leave it blank")
        .positive("Must be positive number")
        .integer("Must be a number"),

    username: Yup.string().required("ID login is required"),
    password: Yup.string().required("Password is required")
});

const company_nameSchemaEdit = Yup.object({
    name: Yup.string().required("Company name is required"),
    email: Yup.string()
        .required("Company email is required")
        .email("Invalid email format"),
    max_users: Yup.number()
        .typeError("Must be a number")
        .required("Cannnot leave it blank")
        .positive("Must be positive number")
        .integer("Must be a number"),

    username: Yup.string().required("ID login is required")
});
class SupperAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalAdd: false,
            modalEdit: false,
            modalDelete: false,
            companies: [],
            currentCompany: {},
            notifyDelete: false,
            serverMessage: "",
            showFilter: false,

            itemPerPage: 25,
            total: 0,
            totalPage: 0,
            offset: 0,
            search: "",

            sort: {
                company: "",
                max_users: "",
                total_users: "",
                date_created: "desc",
                tableLoading: false
            },

            dateStart: null,
            dateEnd: null
        };
        this.fetchData = this.fetchData.bind(this);
        this.RenderRow = this.RenderRow.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState(
            {
                tableLoading: true
            },
            async () => {
                const rs = await window.axios.get(
                    window.baseURL + "/admin/companies",
                    {
                        params: {
                            itemPerPage: this.state.itemPerPage,
                            offset: this.state.offset,
                            sort: this.state.sort,
                            filter: {
                                dateStart:
                                    this.state.dateStart !== null
                                        ? moment(this.state.dateStart).format(
                                              "DD-MM-YYYY"
                                          )
                                        : null,
                                dateEnd:
                                    this.state.dateStart !== null
                                        ? moment(this.state.dateEnd).format(
                                              "DD-MM-YYYY"
                                          )
                                        : null
                            },
                            search: this.state.search
                        }
                    }
                );
                this.setState({
                    companies: rs.data.companies,
                    tableLoading: false,
                    total: rs.data.total,
                    totalPage: Math.ceil(rs.data.total / this.state.itemPerPage)
                });
            }
        );
    }

    handleEdit(values) {
        this.setState(
            {
                loading: true,
                serverMessage: ""
            },
            async () => {
                try {
                    const rs = await window.axios.put(
                        window.baseURL + "/admin/companies",
                        {
                            id: this.state.currentCompany.id,
                            name: values.name,
                            email: values.email,
                            max_users: values.max_users,
                            username: values.username,
                            password: values.password
                        }
                    );
                    if (rs.data.statusCode == 200) {
                        this.setState({
                            modalEdit: false
                        });
                        this.fetchData();
                        this.props.notify.success("Edit successfully");
                    }
                } catch (error) {
                    var temp = "";
                    for (const [key, value] of Object.entries(
                        error.data.errors
                    )) {
                        error.data.errors[key].forEach(element => {
                            temp = temp + element + "<br/>";
                        });
                    }
                    this.setState({
                        serverMessage: temp
                    });
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    handleAdd(values) {
        this.setState(
            {
                loading: true,
                serverMessage: ""
            },
            async () => {
                try {
                    const rs = await window.axios.post(
                        window.baseURL + "/admin/companies",
                        {
                            name: values.name,
                            email: values.email,
                            max_users: values.max_users,
                            username: values.username,
                            password: values.password
                        }
                    );
                    if (rs.data.statusCode == 200) {
                        this.setState({
                            modalAdd: false
                        });
                        this.fetchData();
                    }
                } catch (error) {
                    var temp = "";
                    for (const [key, value] of Object.entries(
                        error.data.errors
                    )) {
                        error.data.errors[key].forEach(element => {
                            temp = temp + element + "<br/>";
                        });
                    }
                    this.setState({
                        serverMessage: temp
                    });
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    handleDelete() {
        this.setState(
            {
                loading: true
            },
            async () => {
                try {
                    const rs = await window.axios.delete(
                        window.baseURL + "/admin/companies",
                        {
                            params: {
                                id: this.state.currentCompany.id
                            }
                        }
                    );
                    if (rs.data.statusCode == 200) {
                        this.setState({
                            modalDelete: false
                        });
                        this.fetchData();
                        this.props.notify.success("Delete successfully");
                    }
                } catch (error) {
                    this.props.notify.error();
                } finally {
                    this.setState({
                        loading: false
                    });
                }
            }
        );
    }
    render() {
        const {
            loading,
            modalAdd,
            tableLoading,
            companies,
            itemPerPage,
            totalPage,
            total,
            offset,
            sort,
            search,
            modalEdit,
            modalDelete,
            currentCompany,
            serverMessage,
            notifyDelete,
            showFilter,
            dateStart,
            dateEnd
        } = this.state;

        return (
            <SupperAdminLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="max-w-7xl mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Organization Management
                        </h1>
                    </div>
                    <div className="flex justify-between items-center col-gap-10">
                        <SearchBar
                            value={search}
                            onChange={value => this.setState({ search: value })}
                            handleSearch={this.fetchData}
                        />
                    </div>

                    <div className="flex justify-between mt-6">
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
                        <Button
                            onClick={() =>
                                this.setState({
                                    modalAdd: true
                                })
                            }
                        >
                            <svg
                                className="w-3 mr-3 "
                                fill="#FFF"
                                viewBox="0 0 469.33333 469.33333"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="m437.332031 192h-160v-160c0-17.664062-14.335937-32-32-32h-21.332031c-17.664062 0-32 14.335938-32 32v160h-160c-17.664062 0-32 14.335938-32 32v21.332031c0 17.664063 14.335938 32 32 32h160v160c0 17.664063 14.335938 32 32 32h21.332031c17.664063 0 32-14.335937 32-32v-160h160c17.664063 0 32-14.335937 32-32v-21.332031c0-17.664062-14.335937-32-32-32zm0 0" />
                            </svg>
                            Add New Company
                        </Button>
                    </div>
                    <Collapse isOpened={showFilter}>
                        <div className="pb-12">
                            <div className="flex justify-start flex-wrap pt-3">
                                <div>
                                    <label
                                        id="listbox-label"
                                        className="mb-3 block text-sm leading-5 font-medium text-gray-700"
                                    >
                                        Start Date Created
                                    </label>
                                    <AppDatePicker
                                        value={dateStart}
                                        onChange={value =>
                                            this.setState({
                                                dateStart: value
                                            })
                                        }
                                    />
                                </div>
                                <div className="ml-6">
                                    <label
                                        id="listbox-label"
                                        className="mb-3 block text-sm leading-5 font-medium text-gray-700"
                                    >
                                        End Date Created
                                    </label>
                                    <AppDatePicker
                                        value={dateEnd}
                                        onChange={value =>
                                            this.setState({
                                                dateEnd: value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            <Button
                                onClick={() => {
                                    this.setState(
                                        {
                                            offset: 0
                                        },
                                        this.fetchData
                                    );
                                }}
                            >
                                Apply Filter
                            </Button>
                        </div>
                    </Collapse>
                    <div className="flex flex-col my-10">
                        <div className="-my-2 sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow border-b border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className=" px-6 py-3 w-12 bg-gray-800"></th>
                                                <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider whitespace-no-wrap">
                                                    <div
                                                        onClick={() => {
                                                            this.setState({
                                                                sort: {
                                                                    company:
                                                                        sort.company ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    total_users:
                                                                        "",
                                                                    date_created:
                                                                        "",
                                                                    max_users:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Company name
                                                        {sort.company !== "" &&
                                                            (sort.company ==
                                                            "desc" ? (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3 transform rotate-180"
                                                                />
                                                            ))}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider whitespace-no-wrap">
                                                    <div
                                                        onClick={() => {
                                                            this.setState({
                                                                sort: {
                                                                    company: "",
                                                                    max_users:
                                                                        sort.max_users ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    date_created:
                                                                        "",
                                                                    total_users:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Max Users
                                                        {sort.max_users !==
                                                            "" &&
                                                            (sort.max_users ==
                                                            "desc" ? (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3 transform rotate-180"
                                                                />
                                                            ))}
                                                    </div>
                                                </th>

                                                <th className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider whitespace-no-wrap">
                                                    <div
                                                        onClick={() => {
                                                            this.setState({
                                                                sort: {
                                                                    company: "",
                                                                    total_users:
                                                                        sort.total_users ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    date_created:
                                                                        "",
                                                                    max_users:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Total Users
                                                        {sort.total_users !==
                                                            "" &&
                                                            (sort.total_users ==
                                                            "desc" ? (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3 transform rotate-180"
                                                                />
                                                            ))}
                                                    </div>
                                                </th>

                                                <th className=" px-6 py-3 bg-gray-800 w-40 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider whitespace-no-wrap">
                                                    <div
                                                        onClick={() => {
                                                            this.setState({
                                                                sort: {
                                                                    company: "",
                                                                    total_users:
                                                                        "",
                                                                    date_created:
                                                                        sort.date_created ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    max_users:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Date Created
                                                        {sort.date_created !==
                                                            "" &&
                                                            (sort.date_created ==
                                                            "desc" ? (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        window.baseURL +
                                                                        "/public/images/arrow-down.svg"
                                                                    }
                                                                    className="w-4 ml-3 transform rotate-180"
                                                                />
                                                            ))}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 bg-gray-800 w-32"></th>
                                            </tr>
                                        </thead>
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
                                                this.RenderRow()
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
                                        this.fetchData
                                    )
                                }
                            />
                        }
                        data={companies}
                        totalPage={totalPage}
                        total={total}
                        offset={offset}
                        itemsPerPage={itemPerPage}
                        onChange={offset =>
                            this.setState(
                                {
                                    offset: offset
                                },
                                this.fetchData()
                            )
                        }
                    />
                </div>
                {notifyDelete && (
                    <NotifyPopup
                        onCancle={() => this.setState({ notifyDelete: false })}
                        title="Unable to delete"
                        description="Cannot delete. This company has active users!"
                    />
                )}
                {modalAdd && (
                    <ModalContainer
                        onClick={() =>
                            this.setState({
                                modalAdd: false
                            })
                        }
                    >
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                max_users: 5,
                                username: "",
                                password: ""
                            }}
                            validationSchema={company_nameSchema}
                            onSubmit={values => this.handleAdd(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-tl-lg rounded-tr-lg p-3 border-b-2 border-gray-300 bg-gray-200 rounded-">
                                        <h6 className="label text-xl">
                                            Add new company
                                        </h6>
                                    </div>
                                    <div className="pl-3 pr-3">
                                        {serverMessage !== "" && (
                                            <AppError message={serverMessage} />
                                        )}
                                    </div>

                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company name"
                                            required
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            error={errors.name && touched.name}
                                        />
                                        {errors.name && touched.name && (
                                            <AppError message={errors.name} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Email"
                                            required
                                            name="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={
                                                errors.email && touched.email
                                            }
                                        />
                                        {errors.email && touched.email && (
                                            <AppError message={errors.email} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Max user"
                                            required
                                            name="max_users"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.max_users}
                                            error={
                                                errors.max_users &&
                                                touched.max_users
                                            }
                                        />
                                        {errors.max_users &&
                                            touched.max_users && (
                                                <AppError
                                                    message={errors.max_users}
                                                />
                                            )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Login ID"
                                            required
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            error={
                                                errors.username &&
                                                touched.username
                                            }
                                        />
                                        {errors.username &&
                                            touched.username && (
                                                <AppError
                                                    message={errors.username}
                                                />
                                            )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Password"
                                            required
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={
                                                errors.password &&
                                                touched.password
                                            }
                                        />
                                        {errors.password &&
                                            touched.password && (
                                                <AppError
                                                    message={errors.password}
                                                />
                                            )}
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Save
                                            </Button>
                                        </span>
                                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                            <Button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    this.setState({
                                                        modalAdd: false
                                                    })
                                                }
                                                backgroundColor="bg-white "
                                                textColor="text-black"
                                                extraClass="border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue "
                                            >
                                                Cancel
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </ModalContainer>
                )}
                {modalEdit && (
                    <ModalContainer
                        onClick={() =>
                            this.setState({
                                modalEdit: false
                            })
                        }
                    >
                        <Formik
                            initialValues={{
                                name: currentCompany.name,
                                email: currentCompany.email,
                                max_users: currentCompany.max_users,
                                username: currentCompany.username,
                                password: ""
                            }}
                            validationSchema={company_nameSchemaEdit}
                            onSubmit={values => this.handleEdit(values)}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                touched,
                                handleSubmit,
                                values,
                                errors
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="rounded-tl-lg rounded-tr-lg p-3 border-b-2 border-gray-300 bg-gray-200 rounded-">
                                        <h6 className="label text-xl">
                                            Add new company
                                        </h6>
                                    </div>
                                    <div className="pl-3 pr-3">
                                        {serverMessage !== "" && (
                                            <AppError message={serverMessage} />
                                        )}
                                    </div>

                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company name"
                                            required
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            error={errors.name && touched.name}
                                        />
                                        {errors.name && touched.name && (
                                            <AppError message={errors.name} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Email"
                                            required
                                            name="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={
                                                errors.email && touched.email
                                            }
                                        />
                                        {errors.email && touched.email && (
                                            <AppError message={errors.email} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Max user"
                                            required
                                            name="max_users"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.max_users}
                                            error={
                                                errors.max_users &&
                                                touched.max_users
                                            }
                                        />
                                        {errors.max_users &&
                                            touched.max_users && (
                                                <AppError
                                                    message={errors.max_users}
                                                />
                                            )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Login ID"
                                            required
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            error={
                                                errors.username &&
                                                touched.username
                                            }
                                        />
                                        {errors.username &&
                                            touched.username && (
                                                <AppError
                                                    message={errors.username}
                                                />
                                            )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Password"
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={
                                                errors.password &&
                                                touched.password
                                            }
                                        />
                                        {errors.password &&
                                            touched.password && (
                                                <AppError
                                                    message={errors.password}
                                                />
                                            )}
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                Edit
                                            </Button>
                                        </span>
                                        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                                            <Button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    this.setState({
                                                        modalEdit: false
                                                    })
                                                }
                                                backgroundColor="bg-white "
                                                textColor="text-black"
                                                extraClass="border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue "
                                            >
                                                Cancel
                                            </Button>
                                        </span>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </ModalContainer>
                )}
                {modalDelete && (
                    <DeletePopup
                        onCancle={() => this.setState({ modalDelete: false })}
                        onDelete={this.handleDelete}
                    />
                )}
            </SupperAdminLayout>
        );
    }
    RenderRow() {
        const { companies } = this.state;
        return companies.length == 0 ? (
            <tr>
                <td
                    colSpan="5"
                    className="text-center px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
                >
                    No data
                </td>
            </tr>
        ) : (
            companies.map((company, index) => (
                <tr key={company.id}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-no-wrap ">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                            {company.name}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-900">
                            {company.max_users}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-900">
                            {company.total_users}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                        {moment(company.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right flex items-center gap-3">
                        <button
                            onClick={() =>
                                this.setState({
                                    currentCompany: company,
                                    modalEdit: true
                                })
                            }
                            className="text-indigo-600 hover:text-indigo-900 appearance-none text-sm leading-5 font-medium"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                if (company.total_users > 0) {
                                    this.setState({
                                        notifyDelete: true
                                    });
                                } else {
                                    this.setState({
                                        currentCompany: company,
                                        modalDelete: true
                                    });
                                }
                            }}
                            className="text-red-600 hover:text-red-900 appearance-none text-sm leading-5 font-medium"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))
        );
    }
}
export default ContextWrapper(SupperAdmin);
