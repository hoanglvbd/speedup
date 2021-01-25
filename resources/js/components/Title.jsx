import React from "react";

const Title = ({ number, children, containerStyle }) => {
    return (
        <div style={{ ...containerStyle }} className="flex">
            {number && (
                <span className="text-black sm:text-xl text-lg font-semibold whitespace-no-wrap pr-3">
                    {number}.
                </span>
            )}
            <h6 className="pb-2 font-semibold sm:text-xl text-lg text-gray-600 ">
                {children}
            </h6>
        </div>
    );
};

export default Title;
