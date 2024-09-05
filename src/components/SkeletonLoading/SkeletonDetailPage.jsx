import React from "react";
import { Col, Row } from "reactstrap";
import SkeletonLoading from ".";

const SkeletonDetailPage = ({ height = 130 }) => {
  return (
    <>
      <Row>
        <Col sm="12" md="6" className="mb-3">
          <SkeletonLoading type="box" count={1} width={"100%"} height={300} />
        </Col>
        <Col sm="6" md="6" className="mb-3">
          <SkeletonLoading type="box" count={1} width={"100%"} height={300} />
        </Col>
        <Col sm="6" md="6" className="mb-3">
          <SkeletonLoading type="box" count={1} width={"100%"} height={300} />
        </Col>
        <Col sm="12" md="6" className="mb-3">
          <SkeletonLoading type="box" count={1} width={"100%"} height={300} />
        </Col>
      </Row>
    </>
  );
};

export default SkeletonDetailPage;
