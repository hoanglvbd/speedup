import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Button = React.forwardRef(
    (
        {
            children,
            disabled = false,
            backgroundColor = "",
            textColor = "",
            extraClass,
            loading = false,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                {...props}
                disabled={disabled}
                className={
                    (backgroundColor !== "" ? backgroundColor : " bg-main ") +
                    (textColor !== "" ? textColor : " text-white ") +
                    " whitespace-no-wrap items-center flex justify-center relative px-4 py-1 border border-transparent text-sm leading-6 font-medium rounded-md transition ease-in-out duration-150 " +
                    extraClass +
                    (disabled || loading
                        ? " bg-gray-400 cursor-not-allowed opacity-50"
                        : " focus:outline-none focus:shadow-outline-indigo")
                }
            >
                {loading ? (
                    <Loader
                        type="TailSpin"
                        color="#FFF"
                        height={25}
                        radius={3}
                        width={25}
                        timeout={0} //3 secs
                    />
                ) : (
                    children
                )}
            </button>
        );
    }
);

export default Button;
