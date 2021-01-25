import React from "react";

const ButtonSubmit = ({ onClick, disabled, loading }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type="button"
            className={
                (disabled ? "opacity-50" : "") +
                (loading ? "cursor-wait opacity-50" : "") +
                " block my-10 mx-auto border shadow-md items-center justify-center px-5 py-3 text-base leading-6 font-medium rounded-md bg-main text-white hover:text-white focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            }
        >
            Submit
        </button>
    );
};

export default ButtonSubmit;
