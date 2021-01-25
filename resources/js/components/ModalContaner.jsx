import React, { useEffect } from "react";
import BackDrop from "./BackDrop";
import { motion } from "framer-motion";
const ModalContainer = ({ onClick, width = "w-172", children }) => {
    return (
        <>
            <BackDrop showBackDrop={true} onClick={onClick} />
            <div className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center flex">
                <motion.div
                    initial={{
                        scale: 0.8,
                        opacity: 0.8
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.2
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                    className={
                        width + " bg-white rounded-lg fixed z-40 overflow-auto"
                    }
                    style={{
                        maxHeight: "calc(100vh - 30px)"
                    }}
                >
                    {children}
                </motion.div>
            </div>
        </>
    );
};

export default ModalContainer;
