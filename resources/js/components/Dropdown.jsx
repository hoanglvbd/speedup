import { motion } from "framer-motion";
import React, { Component } from "react";
import Button from "./Button";
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
class Dropdown extends Component {
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
        const {
            children,
            text,
            icon,
            textColor = " text-gray-500 ",
            bgColor = "bg-white",
            disabled = false
        } = this.props;
        return (
            <div className="flex items-center">
                <div className="relative inline-block">
                    <Button
                        disabled={disabled}
                        onClick={this.toggle}
                        textColor={textColor}
                        backgroundColor={bgColor}
                    >
                        {icon}

                        {text}
                    </Button>
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
                        <div className="rounded bg-white shadow-xs  px-3 py-2">
                            <div
                                className="py-1 flex flex-col items-start"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                            >
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }
}

export default Dropdown;
