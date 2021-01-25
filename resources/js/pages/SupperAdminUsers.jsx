import React, { Component } from "react";
import SupperAdminLayout from "../pageComponents/SupperAdminLayout";

class SupperAdminUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <SupperAdminLayout>
                <div className="w-full ml-56 mr-3">
                    <div className="flex justify-between items-center mx-auto py-6">
                        <h1 className="text-base font-bold leading-tight text-gray-900">
                            Users Management
                        </h1>
                    </div>
                </div>
            </SupperAdminLayout>
        );
    }
}

export default SupperAdminUsers;
