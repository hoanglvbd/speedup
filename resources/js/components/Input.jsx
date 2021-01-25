import React from "react";

const Input = React.forwardRef(
    ({ title, type = "text", IconLeft, extraClass, error, ...props }, ref) => {
        return (
            <div className={"flex flex-col justify-between relative"}>
                {title && (
                    <label
                        className="label"
                        dangerouslySetInnerHTML={{ __html: title }}
                    ></label>
                )}

                <div className="flex items-center justify-center relative">
                    <input
                        ref={ref}
                        type={type}
                        className={
                            "form " +
                            (error ? " border-red-600 " : "") +
                            extraClass +
                            (IconLeft ? " pr-12" : "")
                        }
                        {...props}
                    />
                    {IconLeft && <IconLeft />}
                </div>
            </div>
        );
    }
);
export default Input;
