import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const variants = {
    closed: { opacity: 0 },
    opened: { opacity: 0.5 }
};

let timeOut;
const BackDrop = ({ onClick, showBackDrop }) => {
    const [zIndex, setzIndex] = useState(30);
    useEffect(() => {
        if (showBackDrop === false) {
            timeOut = setTimeout(() => {
                setzIndex(-1);
            }, 600);
        } else {
            setzIndex(30);
        }
        return () => {
            clearTimeout(timeOut);
        };
    }, [showBackDrop]);
    return (
        <motion.div
            animate={showBackDrop ? "opened" : "closed"}
            transition={{
                duration: 0.2
            }}
            initial={{
                opacity: 0
            }}
            exit={{
                opacity: 0
            }}
            variants={variants}
            className="fixed right-0 left-0 top-0 bottom-0 opacity-50 bg-black"
            style={{ backdropFilter: "blur(20px)", zIndex: zIndex }}
            onClick={onClick}
        ></motion.div>
    );
};

export default BackDrop;
