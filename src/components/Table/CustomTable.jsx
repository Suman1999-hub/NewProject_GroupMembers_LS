import React, { useCallback } from "react";
import { FormGroup, Input, Table } from "reactstrap";
import SkeletonLoading from "../SkeletonLoading";
import CustomPagination from "./CustomPagination";

const CustomTable = ({
  className = "",
  data,
  dataCount,
  dataPayload,
  onPageChange = () => {},
  onSizeChange = () => {},
  toggleSortBy = () => {},
  loading = false,
  isRowSelection = false,
  isSelectAll = false,
  selectedDataIds = [],
  onChangeSelectedData,
  headerKeys,
  dataFormat,
  rowStyleFormat,
  rowClassName,
  isPageStartFromOne = false,
  striped = false,
  isPagination = true,
}) => {
  const isRowSelected = useCallback(
    (eachRow) => {
      if (!headerKeys?.length || !selectedDataIds?.length) return false;

      return selectedDataIds?.find(
        (selectedId) => selectedId === eachRow[headerKeys?.[0]?.id]
      )
        ? true
        : false;
    },
    [selectedDataIds, headerKeys]
  );

  if (!headerKeys?.length) return <></>;

  return (
    <>
      <div
        className={`tableWrapper ${
          isRowSelection ? "checkboxTable" : ""
        } ${className}`}
      >
        <Table striped={striped} responsive>
          <thead>
            <tr className={loading ? "tableRowLoading" : ""}>
              {headerKeys.map(
                (eachHeading, headingIndex) =>
                  eachHeading.id !== "id" &&
                  eachHeading.id !== "_id" && (
                    <th
                      key={`table_heading_${
                        eachHeading[headerKeys?.[0]?.id] || headingIndex
                      }`}
                      className={
                        (isRowSelection && headingIndex === 1
                          ? "checkBoxColumn "
                          : "") + eachHeading?.className
                          ? eachHeading.className
                          : ""
                      }
                      style={eachHeading?.style ? eachHeading.style : {}}
                    >
                      <div className="d-flex align-items-center">
                        {isRowSelection &&
                        headingIndex === 1 &&
                        data?.length ? (
                          <FormGroup check className="mb-0">
                            <Input
                              id={`all_row_selection`}
                              type="checkbox"
                              className="mt-0 me-3"
                              onChange={(e) =>
                                onChangeSelectedData("all", e.target.checked)
                              }
                              checked={
                                isSelectAll ||
                                (selectedDataIds?.length &&
                                  data.every((eachTableData) =>
                                    selectedDataIds?.find(
                                      (selectedId) =>
                                        selectedId ===
                                        eachTableData[headerKeys?.[0]?.id]
                                    )
                                  ))
                                  ? true
                                  : false
                              }
                            />
                          </FormGroup>
                        ) : null}

                        <span
                          className={`${
                            eachHeading.isSort ? "cursorPointer" : ""
                          }`}
                          onClick={() =>
                            eachHeading.isSort
                              ? toggleSortBy(eachHeading.id)
                              : {}
                          }
                        >
                          {eachHeading.label}
                          {
                            eachHeading.isSort && (
                              <i className="fas fa-sort ms-1" />
                            )
                            // dataPayload?.sortBy === eachHeading.id && (
                            // (dataPayload?.orderBy === 1 ? (
                            //   <i className="fas fa-sort-up ms-1" />
                            // ) : (
                            //   <i className="fas fa-sort-down ms-1" />
                            // ))
                            // )
                          }
                        </span>
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((eachRow, rowIndex) => (
                <tr
                  key={eachRow[headerKeys?.[0]?.id] || rowIndex}
                  className={`${
                    rowClassName ? rowClassName(eachRow, rowIndex) || "" : ""
                  } ${isRowSelected(eachRow) ? "isRowSelected" : ""}
                  `}
                  style={
                    rowStyleFormat ? rowStyleFormat(eachRow, rowIndex) : {}
                  }
                >
                  {headerKeys.map(
                    (eachHeading, headingIndex) =>
                      eachHeading.id !== "id" &&
                      eachHeading.id !== "_id" && (
                        <td
                          key={`table_details_${
                            eachRow[headerKeys?.[0]?.id] || rowIndex
                          }_${
                            eachHeading[headerKeys?.[0]?.id] || headingIndex
                          }`}
                          className={
                            eachHeading?.className ? eachHeading.className : ""
                          }
                          style={eachHeading?.style ? eachHeading.style : {}}
                        >
                          {isRowSelection ? (
                            <div className="d-flex">
                              {isRowSelection && headingIndex === 1 ? (
                                <>
                                  <FormGroup
                                    check
                                    className="mb-0"
                                    style={{ marginTop: "2px" }}
                                  >
                                    <Input
                                      className="mt-0 me-3"
                                      id={`row_selection_${
                                        eachRow[headerKeys?.[0]?.id] || rowIndex
                                      }`}
                                      type="checkbox"
                                      onChange={(e) =>
                                        onChangeSelectedData(
                                          eachRow,
                                          e.target.checked
                                        )
                                      }
                                      checked={
                                        isSelectAll || isRowSelected(eachRow)
                                      }
                                    />
                                  </FormGroup>
                                </>
                              ) : null}

                              {dataFormat
                                ? dataFormat(
                                    eachRow[eachHeading.id],
                                    eachRow,
                                    eachHeading.id,
                                    rowIndex
                                  )
                                : eachRow[eachHeading.id]}
                            </div>
                          ) : (
                            <>
                              {dataFormat
                                ? dataFormat(
                                    eachRow[eachHeading.id],
                                    eachRow,
                                    eachHeading.id,
                                    rowIndex
                                  )
                                : eachRow[eachHeading.id]}
                            </>
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))
            ) : loading ? (
              <SkeletonLoading
                type="table"
                height={20}
                row={5}
                col={headerKeys?.length - 1 + (isRowSelection ? 1 : 0)}
              />
            ) : (
              <tr className="text-center">
                <td colSpan={headerKeys?.length - 1 + (isRowSelection ? 1 : 0)}>
                  <div className="nodata">
                    <img
                      src={require("../../assets/img/noData.svg").default}
                      alt="no data"
                    />
                    <p>There is no data to display</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {isPagination ? (
        //  && totalCount > limit
        <CustomPagination
          data={data}
          dataCount={dataCount}
          dataPayload={dataPayload}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
          isPageStartFromOne={isPageStartFromOne}
          loading={loading}
        />
      ) : null}
    </>
  );
};

export default CustomTable;
