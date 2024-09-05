import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Row, Col } from "reactstrap";

const PaginatedItems = ({
  items,
  currentPage,
  itemsPerPage,
  onItemsChange = () => {},
  onPageChange = (ele) => {},
}) => {
  const pageCount = Math.ceil(items?.length / itemsPerPage);
  const itemOffset = (currentPage - 1) * itemsPerPage;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    if (onPageChange) onPageChange(event?.selected + 1);
  };

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    const newItems = items?.slice(itemOffset, endOffset);
    onItemsChange(newItems);
  }, [itemOffset, items, itemsPerPage, onItemsChange]);

  return (
    <>
      <Row className="align-items-center paginationWrapper">
        <Col md={6}>
          <div className="tableCount">{`Showing ${itemOffset + 1} - ${
            itemOffset + itemsPerPage > items?.length
              ? items?.length
              : itemOffset + itemsPerPage
          } entries out of ${items?.length} entries`}</div>
        </Col>

        <Col md={6}>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            {...(currentPage && { forcePage: currentPage - 1 })}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            className="pagination justify-content-end"
          />
        </Col>
      </Row>
    </>
  );
};

export default PaginatedItems;
