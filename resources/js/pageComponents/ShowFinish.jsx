import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const ShowFinish = ({ remainTime }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{
                opacity: 0,
                translateX: 40
            }}
            animate={{
                opacity: 1,
                translateX: 0
            }}
            className="flex items-center justify-center flex-col"
        >
            <div className="p-10">
                <div>
                    <img
                        src={window.baseURL + "/public/images/logo.png"}
                        alt=""
                        className="w-56  mx-auto"
                    />
                    <h2 className="text-2xl text-center">
                        {t("submit_success")}
                    </h2>
                    <p className="pb-6 text-center">{t("subheader")}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ShowFinish;
