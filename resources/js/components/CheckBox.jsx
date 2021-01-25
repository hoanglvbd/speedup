import React from "react";

const CheckBox = ({ id, ...props }) => {
    return (
        <input
            id={id}
            type="checkbox"
            {...props}
            className="form-checkbox h-5 w-5  text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
        />
    );
};

export default CheckBox;
