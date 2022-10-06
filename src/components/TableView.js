import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import components from "components";
import { formatIntToHex } from "utils";

createTheme("solarized", {
  background: {
    default: "transparent"
  },
  divider: {
    default: "#434a5238"
  },
  text: {
    primary: "gray",
    secondary: "#36abd2"
  }
});

const TableView = props => {
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = page => {
    let cursor;
    let count;
    if (props.isCustomPagination) {
      if (page > currentPage) {
        cursor = props.pageInfo.last;
        count = perPage;
      } else {
        cursor = props.pageInfo.first;
        count = perPage - 2 * perPage;
      }
    } else {
      count = perPage;
      cursor = formatIntToHex(props.totalCount - (page - 1) * count);
    }
    props.fetchMoreData(cursor);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    let cursor;
    if (props.isCustomPagination) {
      if (page > currentPage) {
        cursor = props.pageInfo.last;
      } else {
        cursor = props.pageInfo.first;
      }
    } else {
      cursor = formatIntToHex(props.totalCount - (page - 1) * newPerPage);
    }
    props.fetchMoreData(cursor, newPerPage);
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  return (
    <div
      className={`relative mb-2 bg-gray-100 text-black  dark:text-gray-300 border-solid border-grey-light dark:border-blue-light  shadow-xl`}
    >
      <div
        className={`p-3  overflow-y-auto dark:bg-[#2c2e3f] dark:text-gray-300  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full ${props.classes
          ? props.classes
          : ""}`}
      >
        {props.loading
          ? <components.Loading />
          : props.isLocalPagination == true
            ? <DataTable
                columns={props.columns}
                theme="solarized"
                data={props.data}
                responsive={true}
                highlightOnHover={true}
                pagination
                progressComponent={<components.Loading />}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[25, 50, 100]}
                paginationTotalRows={props.totalCount}
                paginationDefaultPage={currentPage}
              />
            : props.isCustomPagination
              ? <div>
                  <components.Pagination
                    direction="rtl"
                    paginationPerPage={perPage}
                    paginationTotalRows={props.totalCount}
                    paginationCurrentPage={currentPage}
                    paginationRowsPerPageOptions={[25, 50, 100]}
                    paginationDefaultPage={currentPage}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                  />
                  <DataTable
                    columns={props.columns}
                    theme="solarized"
                    data={props.data}
                    responsive={true}
                    highlightOnHover={true}
                    progressComponent={<components.Loading />}
                  />
                  <components.Pagination
                    direction="rtl"
                    paginationPerPage={perPage}
                    paginationCurrentPage={currentPage}
                    paginationTotalRows={props.totalCount}
                    paginationRowsPerPageOptions={[25, 50, 100]}
                    paginationDefaultPage={currentPage}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                  />
                </div>
              : <DataTable
                  columns={props.columns}
                  theme="solarized"
                  data={props.data}
                  responsive={true}
                  highlightOnHover={true}
                  pagination
                  paginationServer
                  progressComponent={<components.Loading />}
                  paginationPerPage={perPage}
                  paginationRowsPerPageOptions={[25, 50, 100]}
                  paginationTotalRows={props.totalCount}
                  paginationDefaultPage={currentPage}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                />}
      </div>
      {props.btnLabel &&
        <div className="absolute bottom-0 bg-gray-100  dark:bg-[#2c2e3f] text-xl px-2 py-1 w-full flex justify-center border-solid border-grey-light  dark:border-blue-light  border-t">
          <Link
            className="bg-transparent w-full text-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
            to={props.to}
          >
            {props.btnLabel}
          </Link>
        </div>}
    </div>
  );
};

export default TableView;
