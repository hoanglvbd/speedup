import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

class UserChooseCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [
                {
                    index: 1
                }
            ]
        };
        this.renderCourse = this.renderCourse.bind(this);
    }
    render() {
        return (
            <div className="container">
                <h1 className="text-2xl font-semibold ">Choose A Course</h1>
                <div className="flex">{this.renderCourse()}</div>
            </div>
        );
    }

    renderCourse() {
        const { courses } = this.state;
        return courses.map((course, index) => (
            <Link
                key={index}
                to="/speedup"
                className="bg-white border shadow rounded w-56 h-56 my-6 mr-6 hover:shadow-lg"
            >
                <div className="p-3">
                    <h2 className="text-lg font-semibold">SpeedUp Course</h2>
                </div>
            </Link>
        ));
    }
}

export default UserChooseCourse;
