import { motion } from "framer-motion";
import React from "react";
import GlobalLoading from "./GlobalLoading";

const AnimationQuestionWrapper = ({
    length,
    index,
    children,
    containerHeight
}) => {
    const [width, setWidth] = React.useState(0);
    const [isReady, setReady] = React.useState(false);
    React.useEffect(() => {
        if (window.innerWidth > 767) {
            setWidth("42rem");
        } else {
            setWidth(window.innerWidth + "px");
        }
        setReady(true);
    }, []);
    return !isReady ? null : (
        <div
            className="bg-white overflow-hidden"
            style={{
                height: containerHeight ? containerHeight : "500px",
                width: width
            }}
        >
            <motion.div
                transition={{
                    duration: 0.5,
                    type: "tween"
                }}
                className="h-full"
                initial={{
                    width: "calc(" + width + " * " + length + ")",
                    x: "calc(-" + width + " * " + index + ")"
                }}
                animate={{
                    x: "calc(-" + width + " * " + index + ")"
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AnimationQuestionWrapper;
