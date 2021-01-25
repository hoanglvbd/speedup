import React from "react";

const AppError = ({ message }) => {
    return (
        <div
            className="text-red-600 text-sm font-bold pt-2"
            dangerouslySetInnerHTML={{ __html: message }}
        ></div>
    );
};

export default AppError;
