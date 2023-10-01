import React from 'react';
import { useTable, useSortBy } from 'react-table';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Spinner } from 'components/UI';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';

const ServerSideTableTwo = ({
  data,
  columns,
  fixedHeader,
  noHeader,
  paginationPerPage,
  paginationRowsPerPageOptions,
  actions,
  selectableRowSelected,
  paginationTotalRows,
  handlePageChange,
  handlePerRowsChange,
  page,
  setPage,
  ...rest
}) => {
  const { theme } = useSelector((state) => state.theme);
  const { t } = useTranslation('common');

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: paginationPerPage,
        sortBy: [{ id: 'id', desc: true }], // Default sorting field and order
      },
      manualSortBy: true,
      pageCount: Math.ceil(paginationTotalRows / paginationPerPage),
    },
    useSortBy
  );

  const handlePerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value);
    handlePerRowsChange(newPerPage, 0); // Reset to the first page when changing per page
  };
  const pageChange = (page) => {
    setPage(page)
  };
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2">
        {actions}
      </div>
      {data.length === 0 ? (
        <Spinner className="mx-auto mt-4" /> // Show spinner when data is being fetched
      ) : (
        <table {...getTableProps()} className="w-full table-auto">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-white"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="py-2 px-4 border-b border-gray-200 dark:border-gray-600"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={pageChange}
        pageRangeDisplayed={5}
        pageCount={paginationTotalRows}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />

      {/* Pagination */}
      <div className="flex items-center justify-start mt-4">
        {/* Per Page Dropdown */}
        <div className="flex items-center mt-2">
          <span className="text-gray-700 dark:text-gray-300 mr-2">Per Page:</span>
          <select
            className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
            value={paginationPerPage}
            onChange={handlePerPageChange}
          >
            {paginationRowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => pageChange(page - 1)}
          disabled={page === 0}
          className={`py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md mr-2 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page + 1} of {Math.ceil(paginationTotalRows / paginationPerPage)}
        </span>
        <button
          onClick={() => pageChange(page + 1)}
          disabled={page === Math.ceil(paginationTotalRows / paginationPerPage) - 1}
          className={`py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md ml-2 ${page === Math.ceil(paginationTotalRows / paginationPerPage) - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Next
        </button>
      </div>

    </div>
  );
};

ServerSideTableTwo.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      selector: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      format: PropTypes.func,
      cell: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      wrap: PropTypes.bool,
    })
  ).isRequired,
  noHeader: PropTypes.bool,
  fixedHeader: PropTypes.bool,
  paginationPerPage: PropTypes.number,
  paginationRowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  actions: PropTypes.element,
  paginationTotalRows: PropTypes.number,
  handlePageChange: PropTypes.func.isRequired,
  handlePerRowsChange: PropTypes.func.isRequired,
};

ServerSideTableTwo.defaultProps = {
  noHeader: false,
  fixedHeader: true,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [5, 10, 25, 50, 100],
};

export default ServerSideTableTwo;
