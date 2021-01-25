import { motion } from "framer-motion";
import React from "react";
import Button from "../components/Button";
const Precaution = ({ onClick }) => {
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
            className="flex items-center justify-center flex-col py-12"
        >
            <div className="sm:w-132">
                <h6 className="font-semibold text-gray-900 text-2xl">Notice</h6>
                <p
                    className="text-gray-500 text-lg py-3"
                    dangerouslySetInnerHTML={{
                        __html: `
                       There are 89 questions in total. The progress is displayed at the bottom of the screen. It takes about 10-15 minutes. Answers other than some inputs are alternatives. Choose the option that best suits you. </br> The meanings of the five-step options from ;I don't think so at all' to 'I strongly think so' are as follows. </br> </br> 1: I don't think so at all </br> 2: I don't think so </br> 3: I can't say either </br> 4: I think so </br> 5: I strongly think so </br> </br> Don't think too much about the answer, just answer intuitively. All questions are required answers. You can return to the previous question until you have sent all the answers. Please note that if you close the browser or turn off the power of the PC in the middle of answering, you may have to start over from the beginning without leaving any answer. Please secure sufficient time, place, and communication environment. Answer all the questions and press the 'Send' button to finish. When the end screen is displayed, close the browser.</p>`
                    }}
                ></p>

                <Button extraClass="mx-auto block my-10" onClick={onClick}>
                    Proceed to the question
                </Button>
            </div>
        </motion.div>
    );
};

export default Precaution;
