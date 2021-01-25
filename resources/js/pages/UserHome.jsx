import React, { Component } from "react";
import UserHeader from "./UserHeader";

class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <main>
                <UserHeader />
                <div className="container">
                    <div className="py-6 text-gray-900 text-lg">Workspaces</div>
                    <div className="flex flex-wrap ">
                        <button
                            className="bg-white border rounded shadow-md mb-6 mr-6 hover:shadow-xl transition-shadow duration-200 focus:outline-none"
                            style={{
                                width: "176px",
                                height: "206px"
                            }}
                        >
                            <div>ViecoiTest</div>
                        </button>

                        <button
                            className="bg-white rounded shadow-md mb-6 mr-6 hover:shadow-xl transition-shadow duration-200"
                            style={{
                                width: "176px",
                                height: "206px"
                            }}
                        ></button>
                    </div>
                </div>
            </main>
        );
    }
}

export default UserHome;
