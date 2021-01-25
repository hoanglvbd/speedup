import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";

const AppDatePicker = ({ value, ...props }) => {
    return (
        <DatePicker
            dateFormat="dd/MM/yyyy"
            wrapperClassName={"w-full"}
            className="shadow-sm cursor-default relative w-full rounded-md border border-gray-300 bg-gray-100 pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            selected={value}
            isClearable
            {...props}
        />
    );
};

export default AppDatePicker;
