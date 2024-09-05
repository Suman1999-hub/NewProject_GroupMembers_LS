import React, { Fragment } from "react";
import { Col } from "reactstrap";
import Skeleton from "react-loading-skeleton";

const SkeletonCard = ({ count = 1, width, height = 160, borderRadius = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Fragment key={`SkeletonCard_${index}`}>
          <Col md={4}>
            <div className="mx-2 mt-2">
              <Skeleton
                {...(height ? { height } : {})}
                {...(width ? { width } : {})}
                {...(borderRadius ? { borderRadius } : {})}
              />
            </div>
          </Col>
        </Fragment>
      ))}
    </>
  );
};

export default SkeletonCard;
