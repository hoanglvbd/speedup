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
class MoreVert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.toggle = this.toggle.bind(this);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (
            this.wrapperRef &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            this.setState({
                show: false
            });
        }
    }
    toggle() {
        this.setState({
            show: !this.state.show
        });
    }
    render() {
        const { show } = this.state;
        const { children } = this.props;
        return (
            <div className="flex items-center w-10">
                <div className="relative inline-block">
                    <button
                        onClick={this.toggle}
                        type="button"
                        className="inline-flex w-6 h-6 items-center justify-center bg-gray-500  rounded-2xl border-gray-300 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                    >
                        <img
                            src={window.baseURL + "/public/images/ellipsis.svg"}
                            className="w-3 h-4"
                        />
                    </button>
                    <motion.div
                        animate={show ? "open" : "closed"}
                        variants={variants}
                        initial={{
                            display: "none"
                        }}
                        transition={{
                            duration: 0.1
                        }}
                        ref={this.wrapperRef}
                        className="origin-top-right absolute z-50 right-0 mt-2 shadow-2xl transform  duration-100"
                    >
                        {/*   {show && (
                        <div
                        ref={this.wrapperRef}
                            className="origin-top-right z-50 absolute right-0 mt-2 border rounded-md shadow-lg transform  duration-100"
                        > */}
                        <div className="rounded-md bg-white shadow-xs">
                            <div
                                className="py-1 flex flex-col"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                            >
                                {children}
                            </div>
                        </div>
                    </motion.div>
                    {/*    </div>
                    )} */}
                </div>
            </div>
        );
    }
}

export default MoreVert;
