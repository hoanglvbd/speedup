import React from "react";

const ButtonNext = React.forwardRef(
    ({ onClick, disabled, title, type = "button", ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                onClick={onClick}
                type={type}
                {...props}
                className={
                    (disabled ? "opacity-50" : "") +
                    " bg-main my-10 border shadow-md inline-flex items-center justify-center px-5 py-2 text-base leading-6 font-medium rounded-md text-white hover:text-white focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                }
            >
                {title}
                <svg
                    width="20"
                    className="ml-3"
                    fill="#FFF"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289L17.7071 9.29289C18.0976 9.68342 18.0976 10.3166 17.7071 10.7071L11.7071 16.7071C11.3166 17.0976 10.6834 17.0976 10.2929 16.7071C9.90237 16.3166 9.90237 15.6834 10.2929 15.2929L14.5858 11L3 11C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9H14.5858L10.2929 4.70711C9.90237 4.31658 9.90237 3.68342 10.2929 3.29289Z"
                        fill="#FFF"
                    />
                </svg>
            </button>
        );
    }
);

export default ButtonNext;
