import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";

const GlobalLoading = ({ containerStyle, title }) => {
    return (
        <div
            style={{ ...containerStyle }}
            className="fixed top-0 left-0 right-0 bottom-0 h-full w-full flex  flex-col justify-center items-center text-center z-50 opacity-75 bg-white"
        >
            <Player
                autoplay
                loop
                src={window.baseURL + "/public/images/loading.json"}
                style={{
                    height: "300px",
                    width: "300px"
                }}
            />
            <p className="font-semibold">{title}</p>
        </div>
    );
};

export default GlobalLoading;
