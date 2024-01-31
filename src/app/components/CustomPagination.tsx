interface CustomPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}

const CustomPagination = ({ currentPage, totalItems, itemsPerPage, paginate }: CustomPaginationProps) => {
  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <div>
      {totalItems > itemsPerPage &&
        Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-2 px-3 py-1 rounded ${
              currentPage === index + 1 ? 'bg-green-700 text-slate-50' : 'bg-gray-300'
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
};

export default CustomPagination;
