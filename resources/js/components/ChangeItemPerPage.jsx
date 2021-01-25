import { motion } from "framer-motion";
import React, { Component } from "react";

const variants = {
    open: { opacity: 1, scale: 1, display: "block" },
    closed: {
        opacity: 0,
        scale: 0.95,
        transitionEnd: {
            display: "none"
        }
    }
};

class ChangeItemPerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
            show: !this.state.show
        });
    }
    render() {
        const { show } = this.state;
        const { onClick, itemPerPage } = this.props;
        return (
            <div className="flex items-center">
                <h2 className="font-semibold mr-6">Results per pages</h2>
                <div className="relative inline-block text-left">
                    <div>
                        <span className="rounded-md shadow-sm">
                            <button
                                onClick={this.toggle}
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                            >
                                {itemPerPage}
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                        </span>
                    </div>
                    <motion.div
                        animate={show ? "open" : "closed"}
                        variants={variants}
                        initial={{
                            display: "none"
                        }}
                        transition={{
                            duration: 0.1
                        }}
                        className="origin-top-right absolute z-50 right-0 mt-2 w-20 rounded-md shadow-lg transform  duration-100"
                    >
                        <div className="rounded-md bg-white shadow-xs">
                            <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                            >
                                <button
                                    onClick={() => {
                                        onClick(25, false);
                                        this.setState({
                                            show: false
                                        });
                                    }}
                                    type="button"
                                    className="dropdown-item"
                                    role="menuitem"
                                >
                                    25
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClick(50, false);
                                        this.setState({
                                            show: false
                                        });
                                    }}
                                    className="dropdown-item"
                                    role="menuitem"
                                >
                                    50
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClick(100, false);
                                        this.setState({
                                            show: false
                                        });
                                    }}
                                    className="dropdown-item"
                                    role="menuitem"
                                >
                                    100
                                </button>
                                <button
                                    type="button"
                                    href="#"
                                    onClick={() => {
                                        onClick(250, false);
                                        this.setState({
                                            show: false
                                        });
                                    }}
                                    className="dropdown-item"
                                    role="menuitem"
                                >
                                    250
                                </button>
                                <button
                                    type="button"
                                    href="#"
                                    onClick={() => {
                                        onClick("All", false);
                                        this.setState({
                                            show: false
                                        });
                                    }}
                                    className="dropdown-item"
                                    role="menuitem"
                                >
                                    All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }
}

export default ChangeItemPerPage;
