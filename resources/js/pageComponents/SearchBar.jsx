import React from "react";
import Input from "../components/Input";

const SearchBar = ({ handleSearch, value, onChange }) => {
    const handleSubmit = event => {
        event.preventDefault();
        handleSearch();
    };
    return (
        <div className="relative">
            <form onSubmit={handleSubmit}>
                <Input
                    placeholder="Search, ...."
                    value={value}
                    extraClass="bg-white"
                    onChange={e => onChange(e.target.value)}
                />

                <button
                    type="submit"
                    className="absolute bg-gray-800 rounded"
                    style={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        padding: "0 10px"
                    }}
                >
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 20 20"
                        fill="#FFF"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z"
                            fill="#FFF"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
