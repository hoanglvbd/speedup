import React from "react";
import Card from "@material-ui/core/Card";

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
        <Card
            ref={ref}
            className={
                (error ? "border-red-600" : "") +
                " sm:p-6 p-4 block w-full bg-white mb-6 border"
            }
            style={{ ...containerStyle }}
        >
            {children}
        </Card>
    );
};

export default QuestionWrapper;
