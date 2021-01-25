import { motion } from "framer-motion";
import React from "react";
import Button from "../components/Button";
import ContextWrapper from "../context/ContextWrapper";

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
const variantsHasTemp = {
    open: { opacity: 1, y: 0, display: "flex" }
};
const ShowNumberOfTime = ({ showTemp, onClick, onContinue, remainTime }) => {
    return (
        <>
            <motion.div
                variants={variantsHasTemp}
                initial={{ opacity: 0, y: 30 }}
                animate={showTemp ? "open" : ""}
                className="my-10 hidden justify-center"
            >
                <div className="px-20 py-4 rounded-lg text-center border-2">
                    <div className="font-semibold text-lg">Welcome back</div>
                    <div>
                        <span>Pick up where you left off.</span>
                        <span className="text-gray-700 italic">Today</span>
                    </div>
                    <button
                        onClick={onContinue}
                        className="mt-6 focus:opacity-50 bg-white focus:outline-none focus:shadow-lg border-2 border-blue-700 text-blue-700 text-center font-semibold px-2 py-1 rounded"
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
            <motion.div
                initial={{
                    opacity: 0,
                    translateX: 40
                }}
                animate={{
                    opacity: 1,
                    translateX: 0
                }}
                className="text-center flex-col"
            >
                <div className="p-6">
                    <div>
                        <img
                            src={window.baseURL + "/public/images/logo.png"}
                            alt=""
                            className="sm:w-56 w-24 mx-auto"
                        />
                        <h2 className=" sm:text-2xl text-base text-center">
                            X-Finder
                            トランスフォーメーションマインドセットアセスメント
                        </h2>
                        <p className="pb-3 text-center">
                            © 2020 Spice Up Japan, Inc.
                        </p>
                    </div>
                    <div className="flex justify-center items-center flex-col">
                        <div>
                            <div className="flex items-center py-1">
                                <div className="w-40 text-left">
                                    <p>
                                        <b>Remain attempt:</b>
                                    </p>
                                </div>
                                <p>{remainTime}</p>
                            </div>
                        </div>
                        <div className="my-3">
                            {remainTime == 0 ? (
                                <div>Out of attempt</div>
                            ) : (
                                <Button
                                    extraClass="mx-auto block"
                                    onClick={() => onClick()}
                                >
                                    Start
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ContextWrapper(ShowNumberOfTime);
