import React, { Component } from "react";
import CompanyLayout from "../pageComponents/CompanyLayout";
import { withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";
import Button from "../components/Button";
import moment from "moment";
class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModalEdit: false,
            answers: []
        };
        this.RenderBodyMain = this.RenderBodyMain.bind(this);
    }
    componentDidMount() {
        let { id } = this.props.match.params;

        window
            .axios(window.baseURL + "/company/users/results/" + id)
            .then(rs => {
                this.setState({
                    user: rs.data.user,
                    answers: rs.data.answers
                });
            });
    }

    render() {
        const { showModalEdit, user } = this.state;
        return (
            <CompanyLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="border-b-2 px-3 py-4 flex items-center justify-between">
                        <div className="font-semibold text-lg">User Detail</div>
                    </div>
                    <div className="flex items-center"></div>

                    <div className="my-10 flex">
                        <div className="w-3/12 rounded">
                            <div className="flex flex-col shadow border">
                                <div className="p-4 font-medium bg-gray-100 border-b">
                                    Personal Information
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        ID
                                    </p>
                                    <p>{user.username}</p>
                                </div>

                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Name
                                    </p>
                                    <p>{user.name}</p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Max Allowed Time Submit
                                    </p>
                                    <p>{user.max_time}</p>
                                </div>
                                <div className="p-4">
                                    <p className="font-medium text-gray-500 text-sm">
                                        Created by
                                    </p>
                                    <p>
                                        {user.is_import == 1
                                            ? "Import"
                                            : "Manually"}
                                    </p>
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
                        <div className="w-9/12 pl-6">
                            <div className="flex flex-col shadow border">
                                <div className="p-4 font-medium bg-gray-100 border-b flex justify-between">
                                    Main Result
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
                                                                Last updated
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
            </CompanyLayout>
        );
    }
    RenderBodyMain() {
        const { answers } = this.state;
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
                                    href={
                                        window.baseURL +
                                        "/company/user/" +
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
                                <a
                                    href={
                                        window.baseURL +
                                        "/company/export/exportraw?user_id=" +
                                        answer.user_id +
                                        "&result_id=" +
                                        answer.id
                                    }
                                    className="bg-green-600 text-white whitespace-no-wrap items-center justify-center px-4 py-1 border border-transparent text-sm leading-6 font-medium rounded-md transition ease-in-out duration-150"
                                >
                                    Download Raw Result
                                </a>
                            </div>
                            <div className="text-sm leading-5 text-gray-900 mx-3">
                                <button
                                    type="button"
                                    /*  onClick={() =>
                                    handleDelete(
                                        result.id,
                                        result.number_of_times
                                    )
                                } */
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
