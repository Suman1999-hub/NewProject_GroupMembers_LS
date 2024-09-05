import React from "react";
import ReactPaginate from "react-paginate";
import { FormGroup, Input, InputGroup, InputGroupText } from "reactstrap";

const CustomPagination = ({
  data,
  dataCount,
  dataPayload,
  onPageChange = () => {},
  onSizeChange = () => {},
  isPageStartFromOne = false,
  loading = false,
}) => {
  if (!data?.length || !dataCount || dataCount < dataPayload?.limit) {
    return <></>;
  }

  const limitOptions = [10, 20, 50, 100];

  return (
    <div className="paginationWrap">
      {/* <span className="showng_entries">
        Showing {data?.length} entries out of {dataCount}
      </span> */}

      <FormGroup>
        <InputGroup>
          <Input
            type="select"
            value={dataPayload.limit}
            onChange={(e) => onSizeChange(+e.target.value || 10)}
          >
            {!limitOptions.includes(dataPayload.limit) ? (
              <option value={dataPayload.limit}>{dataPayload.limit}</option>
            ) : null}
            {limitOptions.map((each) => (
              <option key={each} value={each}>
                {each}
              </option>
            ))}
          </Input>
          {loading ? (
            <InputGroupText>
              <i className="fa fa-spinner fa-spin" />
            </InputGroupText>
          ) : null}
        </InputGroup>
      </FormGroup>

      <ReactPaginate
        forcePage={dataPayload.pageNumber}
        className="pagination justify-content-end"
        breakLabel="..."
        nextLabel={<i className="fa fa-chevron-right" />}
        previousLabel={<i className="fa fa-chevron-left" />}
        previousClassName="previous"
        nextClassName="next"
        onPageChange={({ selected }) =>
          onPageChange(isPageStartFromOne ? selected + 1 : selected)
        }
        pageRangeDisplayed={3}
        pageCount={Math.ceil(dataCount / dataPayload.limit)}
        pageClassName="page-item"
        renderOnZeroPageCount={null}
        containerClassName={"pagination"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
        disabledClassName={"page-item"}
      />
    </div>
  );
};

export default CustomPagination;
