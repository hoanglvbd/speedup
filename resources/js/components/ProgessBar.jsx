import React from "react";

const ProgessBar = ({ obj }) => {
    const [width, setWidth] = React.useState(0);
    const [isReady, setReady] = React.useState(false);

    React.useEffect(() => {
        if (window.innerWidth > 767) {
            setWidth("39rem");
        } else {
            setWidth(window.innerWidth - 30 + "px");
        }
        setReady(true);
    }, []);

    return !isReady ? null : (
        <div className="flex justify-center mb-12">
            <div
                className="h-2 bg-gray-300 rounded shadow relative"
                style={{
                    width: width
                }}
            >
                <div
                    className="h-2 tooltip absolute bottom-0 left-0 right-0 bg-main shadow rounded transition-all duration-300"
                    style={{
                        width: obj.percent
                    }}
                >
                    <span className="tooltiptext">
                        {obj.status} Question Completeness
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProgessBar;
