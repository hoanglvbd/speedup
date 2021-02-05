import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import ContextWrapper from "../context/ContextWrapper";
import Typography from "@material-ui/core/Typography";

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
                        {/*          <h2 className=" text-3xl text-center">{t("header")}</h2> */}
                        <Typography variant="h4" gutterBottom>
                            {t("header")}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            {t("subheader")}
                        </Typography>
                    </div>
                    <div className="flex justify-center items-center flex-col mt-6">
                        {/*  <div>
                            <div className="flex items-center py-1">
                                <div className="w-40 text-left">
                                    <p>
                                        <b> {t("remain_attempt")}:</b>
                                    </p>
                                </div>
                                <p>{remainTime}</p>
                            </div>
                        </div> */}
                        <div className="my-3">
                            {remainTime == 0 ? (
                                <div>{t("out_of_attempt")}</div>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onClick()}
                                >
                                    {t("start")}
                                </Button>
                            )}
                        </div>
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            {t("remain_attempt")}: {remainTime}
                        </Typography>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ContextWrapper(ShowNumberOfTime);
