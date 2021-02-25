import React, { Component } from "react";
import GlobalLoading from "../components/GlobalLoading";
import moment from "moment";
import CompanyLayout from "../pageComponents/CompanyLayout";
import { withRouter } from "react-router-dom";
import ContextWrapper from "../context/ContextWrapper";
import CompanyHeader from "../pageComponents/CompanyHeader";

class ResultDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {},
            result_detail: [],
            user: {},
            levels_positive: [],
            levels_negative: [],
            loading: false
        };
        this.RenderRow = this.RenderRow.bind(this);
    }
    componentDidMount() {
        let { id, user_id } = this.props.match.params;
        this.fetchUser(user_id);
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
    fetchResult() {
        let { id } = this.props.match.params;
        window.axios
            .post(window.baseURL + "/api/results_detail", {
                result_id: id
            })
            .then(rs => {
                this.setState({
                    result_detail: rs.data.result_detail,
                    levels_positive: rs.data.levels_positive,
                    levels_negative: rs.data.levels_negative,
                    result: rs.data.result
                });
            })
            .catch(() => {
                this.props.notify.error();
            });
    }
    render() {
        const { loading, user, result } = this.state;
        return (
            <>
                <CompanyHeader />
                {loading && <GlobalLoading title="Loading" />}
                {!loading && (
                    <div className="w-full ml-64 mr-3 ">
                        <div className="border-b-2 px-3 py-4 ">
                            <div className="font-semibold text-lg">
                                {user.name}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-sm text-gray-600 font-semibold">
                                    No. {result.number_of_times}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {moment(result.updated_at).calendar()}
                                </div>
                            </div>
                        </div>
                        <div className="my-10">
                            <div className="overflow-x-auto">
                                <div className="py-2 align-middle inline-block min-w-full">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="whitespace-no-wrap w-20 text-center px-6 py-3 bg-gray-800  text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                        Number
                                                    </th>
                                                    <th className="whitespace-no-wrap px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                        Question
                                                    </th>
                                                    <th className="whitespace-no-wrap w-20 px-6 py-3 bg-gray-800 text-center text-xs leading-4 font-medium text-white uppercase tracking-wider">
                                                        Answer
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {this.RenderRow()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    RenderRow() {
        const { result_detail, levels_positive, levels_negative } = this.state;
        return result_detail.map((rs, index) => (
            <tr className="hover:bg-gray-100" key={rs.id}>
                <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 text-gray-900">
                        {index + 1}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 text-gray-900">
                        {rs.question}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 text-gray-900">
                        {rs.type == 1
                            ? levels_positive.find(
                                  e => e.group == rs.result.level_id
                              ).level
                            : levels_negative.find(
                                  e => e.group == rs.result.level_id
                              ).level}
                    </div>
                </td>
            </tr>
        ));
    }
}

export default withRouter(ContextWrapper(ResultDetail));
