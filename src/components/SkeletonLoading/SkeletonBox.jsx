import React, { Fragment } from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonBox = ({
  count = 1,
  height = undefined,
  borderRadius = undefined,
  width = undefined,
}) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Fragment key={`SkeletonBox_${index}`}>
          <Skeleton
            {...(height ? { height } : {})}
            {...(width ? { width } : {})}
            borderRadius={borderRadius}
          />
        </Fragment>
      ))}
    </>
  );
};

export default SkeletonBox;
