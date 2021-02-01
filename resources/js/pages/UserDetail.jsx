import React, { Component } from "react";
import CompanyLayout from "../pageComponents/CompanyLayout";
import { withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";
import Button from "../components/Button";
import moment from "moment";
import { at } from "lodash";
import DeletePopup from "../components/DeletePopup";
import StudentEdit from "../pageComponents/StudentEdit";
class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModalEdit: false,
            showDelete: false,
            currentResult: {},
            answers: []
        };
        this.RenderBodyMain = this.RenderBodyMain.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.fetchResult = this.fetchResult.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handledeleteClick = this.handledeleteClick.bind(this);
    }
    componentDidMount() {
        let { id } = this.props.match.params;
        this.fetchUser(id);
    }

    fetchUser(id) {
        window.axios
            .post(window.apiURL, {
                method: "get_detail_user",
                params: {
                    session_token: this.props.auth.token,
                    user_id: id
                }
            })
            .then(rs => {
                if (rs.data.result_code == 1) {
                    this.setState({
                        user: rs.data.result_data
                    });

                    this.fetchResult(id);
                } else {
                    this.props.notify.error(
                        "Fail to retrive data. Please try again!"
                    );
                }
            })
            .catch(() => {
                this.props.notify.error();
            });
    }
    fetchResult(id) {
        window.axios
            .post(window.baseURL + "/api/results", {
                user_id: id
            })
            .then(rs => {
                this.setState({
                    answers: rs.data.results
                });
            })
            .catch(() => {
                this.props.notify.error();
            });
    }
    handleDownload(num, user) {
        window.axios
            .post(window.baseURL + "/api/export/summaryExcel", {
                num: num,
                data: [user]
            })
            .then(rs => {
                if (num == 1) {
                    window.open(window.baseURL + "/Summary_result_No_1.xlsx");
                } else {
                    window.open(window.baseURL + "/Summary_result_No_1_2.xlsx");
                }
            });
    }

    handleDelete(id, time) {
        this.setState({
            currentResult: {
                result_id: id,
                time: time
            },
            showDelete: true,
            deleteContent:
                time == 1
                    ? "Result will not be recoverd?"
                    : "Result will not be recoverd and the second time will become the first time?",
            deleteTitle: time == 1 ? "Delete Result No.1" : "Delete Result No.2"
        });
    }
    handledeleteClick() {
        const { currentResult, user } = this.state;

        window.axios
            .delete(window.baseURL + "/api/result_detail", {
                params: {
                    result_id: currentResult.result_id,
                    user_id: user.user_id,
                    time: currentResult.time
                }
            })
            .then(rs => {
                window.location.reload();
            });
    }
    render() {
        const {
            showModalEdit,
            user,
            showDelete,
            deleteTitle,
            deleteContent,
            answers
        } = this.state;
        return (
            <CompanyLayout>
                <div className="w-full ml-64 mr-3 ">
                    <div className="border-b-2 px-3 py-4 flex items-center justify-between">
                        <div className="font-semibold text-lg">User Detail</div>
                    </div>
                    <div className="flex items-center"></div>

                    <div className="my-10 flex">
                        <div className="w-3/12 rounded bg-white">
                            <div className="flex flex-col shadow border">
                                <div className="p-4 font-medium bg-gray-100 border-b">
                                    Personal Information
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Email
                                    </p>
                                    <p>{user.email}</p>
                                </div>

                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Name
                                    </p>
                                    <p>{user.name}</p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Address
                                    </p>
                                    <p>{user.address}</p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Birthday
                                    </p>
                                    <p>
                                        {moment(user.birthday).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Gender
                                    </p>
                                    <p>
                                        {user.gender == 1 ? "Male" : "Female"}
                                    </p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Phone
                                    </p>
                                    <p>{user.phone}</p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Max Allowed Time Submit
                                    </p>
                                    <p>{user.max_time}</p>
                                </div>

                                <div className="p-4">
                                    <Button
                                        backgroundColor="bg-indigo-700"
                                        onClick={() =>
                                            this.setState({
                                                showModalEdit: !showModalEdit
                                            })
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="w-9/12 pl-6 ">
                            <div className="flex flex-col shadow border bg-white">
                                <div className="p-4 font-medium bg-gray-100 border-b flex justify-between">
                                    Results
                                </div>
                                <div className="p-4">
                                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200 ">
                                                    <thead>
                                                        <tr>
                                                            <th className="whitespace-no-wrap w-20 px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                                N.o
                                                            </th>
                                                            <th className="whitespace-no-wrap w-20 px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                                Latest update
                                                            </th>
                                                            <th className="whitespace-no-wrap w-20 px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {this.RenderBodyMain()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <StudentEdit
                    resultCount={answers.length}
                    user={user}
                    visible={showModalEdit}
                    handleClose={() => {
                        this.setState({
                            showModalEdit: !showModalEdit
                        });
                    }}
                />
                {showDelete && (
                    <DeletePopup
                        onCancle={() =>
                            this.setState({
                                showDelete: false
                            })
                        }
                        onDelete={() => this.handledeleteClick()}
                        title={deleteTitle}
                        content={deleteContent}
                    />
                )}
            </CompanyLayout>
        );
    }
    RenderBodyMain() {
        const { answers, user } = this.state;
        return answers.length > 0 ? (
            <>
                {answers.map(answer => (
                    <tr className="hover:bg-gray-100" key={answer.id}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="text-sm leading-5 text-gray-900">
                                {answer.number_of_times}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap">
                            <div className="text-sm leading-5 text-gray-900">
                                {moment(answer.updated_at).format("DD/MM/YYYY")}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap flex items-center   ">
                            <div className="text-sm leading-5 text-gray-900 mx-3">
                                <a
                                    target={"_blank"}
                                    href={
                                        window.baseURL +
                                        "/company/users/" +
                                        answer.user_id +
                                        "/detail/" +
                                        answer.id
                                    }
                                    className="bg-indigo-600 text-white whitespace-no-wrap items-center justify-center px-4 py-1 border border-transparent text-sm leading-6 font-medium rounded-md transition ease-in-out duration-150"
                                >
                                    View Detail
                                </a>
                            </div>
                            <div className="text-sm leading-5 text-gray-900 mx-3">
                                <button
                                    onClick={() =>
                                        this.handleDownload(
                                            answer.number_of_times,
                                            user
                                        )
                                    }
                                    className="bg-green-600 text-white whitespace-no-wrap items-center justify-center px-4 py-1 border border-transparent text-sm leading-6 font-medium rounded-md transition ease-in-out duration-150"
                                >
                                    Download Raw Result
                                </button>
                            </div>
                            <div className="text-sm leading-5 text-gray-900 mx-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        this.handleDelete(
                                            answer.id,
                                            answer.number_of_times
                                        )
                                    }
                                    className="bg-red-600 hover:text-red-900 text-white appearance-none  px-4 py-1 rounded-md border text-sm leading-5 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        ) : (
            <tr className="hover:bg-gray-100">
                <td
                    colSpan="3"
                    className="text-center px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500"
                >
                    No data
                </td>
            </tr>
        );
    }
}

export default withRouter(ContextWrapper(UserDetail));
