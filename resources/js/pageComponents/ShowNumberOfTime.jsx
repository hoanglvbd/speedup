import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
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

const ShowNumberOfTime = ({ onClick, remainTime }) => {
    const { t, i18n } = useTranslation();
    return (
        <>
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
                            {t("header")}
                        </h2>
                        <p className="pb-3 text-center">{t("subheader")}</p>
                    </div>
                    <div className="flex justify-center items-center flex-col">
                        <div>
                            <div className="flex items-center py-1">
                                <div className="w-40 text-left">
                                    <p>
                                        <b> {t("remain_attempt")}:</b>
                                    </p>
                                </div>
                                <p>{remainTime}</p>
                            </div>
                        </div>
                        <div className="my-3">
                            {remainTime == 0 ? (
                                <div>{t("out_of_attempt")}</div>
                            ) : (
                                <Button
                                    extraClass="mx-auto block"
                                    onClick={() => onClick()}
                                >
                                    {t("start")}
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
