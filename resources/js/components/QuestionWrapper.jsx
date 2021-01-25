import React from "react";
const QuestionWrapper = ({
    containerStyle,
    addRef = () => {},
    error,
    children
}) => {
    const ref = React.useRef();

    React.useEffect(() => {
        addRef(ref.current.offsetTop);
    }, []);
    return (
        <div
            ref={ref}
            className={
                (error ? "border-red-600" : "") +
                " sm:p-6 p-4 block w-full bg-white shadow border rounded mb-6"
            }
            style={{ ...containerStyle }}
        >
            {children}
        </div>
    );
};

export default QuestionWrapper;
