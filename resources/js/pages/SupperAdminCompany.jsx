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
        .min(0, "Rang 0 -> 100")
        .max(100, "Rang 0 -> 100")
        .integer("Must be a number"),
    address: Yup.string().required("Company address is required"),
    contact_name: Yup.string().required("Contact name is required"),
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
        .min(0, "Rang 0 -> 100")
        .max(100, "Rang 0 -> 100")
        .integer("Must be a number"),
    address: Yup.string().required("Company address is required"),
    contact_name: Yup.string().required("Contact name is required")
});
class SupperAdminCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalView: false,
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
                company_name: "",
                email: "",
                max_users: "",
                total_member: "desc"
            }
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

    componentDidUpdate(prevProps, prevState) {
        const { sort, companies } = this.state;
        if (prevState.sort !== sort) {
            const Copy = [...companies];
            if (sort.company_name !== "") {
                if (sort.company_name == "asc") {
                    Copy.sort((a, b) =>
                        a.company_name.localeCompare(b.company_name)
                    );
                } else {
                    Copy.sort((a, b) =>
                        b.company_name.localeCompare(a.company_name)
                    );
                }
            }
            if (sort.email !== "") {
                if (sort.email == "asc") {
                    Copy.sort((a, b) => a.email.localeCompare(b.email));
                } else {
                    Copy.sort((a, b) => b.email.localeCompare(a.email));
                }
            }
            if (sort.max_users !== "") {
                if (sort.max_users == "asc") {
                    Copy.sort((a, b) => a.max_users - b.max_users);
                } else {
                    Copy.sort((a, b) => b.max_users - a.max_users);
                }
            }
            if (sort.total_member !== "") {
                if (sort.total_member == "asc") {
                    Copy.sort((a, b) => a.total_member - b.total_member);
                } else {
                    Copy.sort((a, b) => b.total_member - a.total_member);
                }
            }
            this.setState({
                companies: Copy
            });
        }
    }
    fetchData() {
        this.setState(
            {
                tableLoading: true
            },
            async () => {
                const rs = await window.axios.post(window.apiURL, {
                    method: "search_company",
                    params: {
                        session_token: this.props.auth.token,
                        size_page: this.state.itemPerPage,
                        current_page:
                            this.state.offset / this.state.itemPerPage,
                        key: this.state.search.trim()
                    }
                });
                this.setState({
                    companies: rs.data.result_data,
                    tableLoading: false,
                    total: rs.data.count,
                    totalPage: Math.ceil(rs.data.count / this.state.itemPerPage)
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
                    const rs = await window.axios.post(window.apiURL, {
                        method: "edit_company",
                        params: {
                            session_token: this.props.auth.token,
                            company_id: this.state.currentCompany.company_id,
                            email: values.email,
                            password: values.password,
                            company_name: values.name,
                            company_address: values.address,
                            website: values.website,
                            name: values.contact_name,
                            phone: values.phone,
                            max_users: values.max_users
                        }
                    });
                    if (rs.data.result_code == 1) {
                        this.setState({
                            modalEdit: false
                        });
                        this.fetchData();
                        this.props.notify.success(rs.data.result_message_text);
                    } else {
                        this.props.notify.error(rs.data.result_message_text);
                    }
                } catch (error) {
                    this.setState({
                        serverMessage: "Unknown error"
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
                    const rs = await window.axios.post(window.apiURL, {
                        method: "create_company",
                        params: {
                            session_token: this.props.auth.token,
                            email: values.email,
                            password: values.password,
                            company_name: values.name,
                            company_address: values.address,
                            website: values.website,
                            name: values.contact_name,
                            phone: values.phone,
                            max_users: values.max_users
                        }
                    });
                    if (rs.data.result_code == 1) {
                        this.setState({
                            modalAdd: false
                        });
                        this.fetchData();
                        this.props.notify.success(rs.data.result_message_text);
                    } else {
                        this.props.notify.error(rs.data.result_message_text);
                    }
                } catch (error) {
                    this.setState({
                        serverMessage: "Unknown error"
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
            modalView,
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
                            Company Management
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
                        <div></div>
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
                    <div className="flex flex-col my-10">
                        <div className="-my-2 sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow border-b border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className=" px-6 py-3 w-40 bg-gray-800"></th>
                                                <th className=" px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider whitespace-no-wrap">
                                                    <div
                                                        onClick={() => {
                                                            this.setState({
                                                                sort: {
                                                                    company_name:
                                                                        sort.company_name ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    email: "",
                                                                    max_users:
                                                                        "",
                                                                    total_member:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Company name
                                                        {sort.company_name !==
                                                            "" &&
                                                            (sort.company_name ==
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
                                                                    company_name:
                                                                        "",
                                                                    email:
                                                                        sort.email ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    max_users:
                                                                        "",
                                                                    total_member:
                                                                        ""
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Email
                                                        {sort.email !== "" &&
                                                            (sort.email ==
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
                                                                    company_name:
                                                                        "",
                                                                    max_users:
                                                                        sort.max_users ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc",
                                                                    email: "",
                                                                    total_member:
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
                                                                    company_name:
                                                                        "",
                                                                    max_users:
                                                                        "",
                                                                    email: "",
                                                                    total_member:
                                                                        sort.total_member ===
                                                                        "desc"
                                                                            ? "asc"
                                                                            : "desc"
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        Total Users
                                                        {sort.total_member !==
                                                            "" &&
                                                            (sort.total_member ==
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
                                address: "",
                                max_users: 5,
                                contact_name: "",
                                password: "",
                                phone: "",
                                website: ""
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
                                            title="Company address"
                                            required
                                            name="address"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.address}
                                            error={
                                                errors.address &&
                                                touched.address
                                            }
                                        />
                                        {errors.address && touched.address && (
                                            <AppError
                                                message={errors.address}
                                            />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Phone"
                                            name="phone"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone}
                                            error={
                                                errors.phone && touched.phone
                                            }
                                        />
                                        {errors.phone && touched.phone && (
                                            <AppError message={errors.phone} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Website"
                                            name="website"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.website}
                                            error={
                                                errors.website &&
                                                touched.website
                                            }
                                        />
                                        {errors.website && touched.website && (
                                            <AppError
                                                message={errors.website}
                                            />
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
                                            title="Contact name"
                                            required
                                            name="contact_name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.contact_name}
                                            error={
                                                errors.contact_name &&
                                                touched.contact_name
                                            }
                                        />
                                        {errors.contact_name &&
                                            touched.contact_name && (
                                                <AppError
                                                    message={
                                                        errors.contact_name
                                                    }
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
                {modalView && (
                    <ModalContainer
                        onClick={() =>
                            this.setState({
                                modalView: false
                            })
                        }
                    >
                        <div className="rounded-tl-lg rounded-tr-lg p-2 border-b-2 border-gray-300 bg-gray-200 rounded-">
                            <h6 className="label text-base">Detail company</h6>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Company Name
                            </p>
                            <p>{currentCompany.company_name}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Company Address
                            </p>
                            <p>{currentCompany.company_address}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Company Website
                            </p>
                            <p>{currentCompany.company_website}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Company Email
                            </p>
                            <p>{currentCompany.email}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Company Phone
                            </p>
                            <p>{currentCompany.phone}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Contact Person
                            </p>
                            <p>{currentCompany.name}</p>
                        </div>
                        <div class="p-4">
                            <p class="font-medium text-gray-500 text-sm">
                                Max User
                            </p>
                            <p>{currentCompany.max_users}</p>
                        </div>
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
                                name: currentCompany.company_name,
                                email: currentCompany.email,
                                address: currentCompany.company_address,
                                max_users: currentCompany.max_users,
                                contact_name: currentCompany.name,
                                password: "",
                                phone: currentCompany.phone,
                                website: currentCompany.company_website
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
                                            Edit company
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
                                            disabled={true}
                                            extraClass="opacity-50"
                                            name="email"
                                            /*    onChange={handleChange} */
                                            /*    onBlur={handleBlur} */
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
                                            title="Company address"
                                            required
                                            name="address"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.address}
                                            error={
                                                errors.address &&
                                                touched.address
                                            }
                                        />
                                        {errors.address && touched.address && (
                                            <AppError
                                                message={errors.address}
                                            />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Phone"
                                            name="phone"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone}
                                            error={
                                                errors.phone && touched.phone
                                            }
                                        />
                                        {errors.phone && touched.phone && (
                                            <AppError message={errors.phone} />
                                        )}
                                    </div>
                                    <div className="p-3 rounded-bl-lg rounded-br-lg">
                                        <Input
                                            title="Company Website"
                                            name="website"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.website}
                                            error={
                                                errors.website &&
                                                touched.website
                                            }
                                        />
                                        {errors.website && touched.website && (
                                            <AppError
                                                message={errors.website}
                                            />
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
                                            title="Contact name"
                                            required
                                            name="contact_name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.contact_name}
                                            error={
                                                errors.contact_name &&
                                                touched.contact_name
                                            }
                                        />
                                        {errors.contact_name &&
                                            touched.contact_name && (
                                                <AppError
                                                    message={
                                                        errors.contact_name
                                                    }
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
                <tr key={company.company_id} className="hover:bg-gray-200">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-no-wrap ">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                            {company.company_name}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap ">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                            {company.email}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-900">
                            {company.max_users}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                        <div className="text-sm leading-5 text-gray-900">
                            {company.total_member}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right flex items-center gap-3">
                        <button
                            onClick={() =>
                                this.setState({
                                    currentCompany: company,
                                    modalView: true
                                })
                            }
                            className="bg-blue-600 text-white rounded px-3 py-1 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                        >
                            View
                        </button>
                        <button
                            onClick={() =>
                                this.setState({
                                    currentCompany: company,
                                    modalEdit: true
                                })
                            }
                            className="bg-indigo-600 text-white rounded px-3 py-1 hover:text-indigo-900 appearance-none text-sm leading-5 font-bold"
                        >
                            Edit
                        </button>
                    </td>
                </tr>
            ))
        );
    }
}

export default ContextWrapper(SupperAdminCompany);
