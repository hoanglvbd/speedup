import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({
    total,
    totalPage,
    offset,
    data = [],
    itemsPerPage,
    itemsPerPageComponent,
    onChange,
    mb = "mb-48"
}) => {
    const handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * itemsPerPage);
        onChange(offset);
    };
    return (
        <div
            className={
                mb +
                " shadow border border-gray-200 bg-white px-4 py-3 flex items-center justify-between sm:px-6  whitespace-no-wrap"
            }
        >
            <div className="flex-1 flex items-center justify-between ">
                <div>{itemsPerPageComponent}</div>
                <div>
                    <ReactPaginate
                        pageCount={totalPage}
                        onPageChange={handlePageClick}
                        containerClassName={
                            "relative z-0 inline-flex shadow-sm"
                        }
                        pageLinkClassName={
                            "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                        }
                        previousLinkClassName=" rounded-l-md relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                        nextLinkClassName="rounded-r-md relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                        activeLinkClassName={"border-blue-700"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pagination;
