import React from "react";
import { Spinner } from "reactstrap";
import SkeletonBox from "./SkeletonBox";
import SkeletonTable from "./SkeletonTable";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonNotificationItem from "./SkeletonNotificationItem";
import SkeletonCard from "./SkeletonCard";
import SkeletonDetailPage from "./SkeletonDetailPage";

const SkeletonLoading = ({
  count,
  type,
  row,
  col,
  height,
  width,
  borderRadius,
}) => {
  switch (type) {
    case "box": {
      return (
        <SkeletonBox
          count={count}
          height={height}
          borderRadius={borderRadius}
          width={width}
        />
      );
    }
    case "card": {
      return (
        <SkeletonCard
          count={count}
          height={height}
          borderRadius={borderRadius}
          width={width}
        />
      );
    }
    case "table": {
      return (
        <SkeletonTable row={row} col={col} height={height} width={width} />
      );
    }
    case "notificationItem": {
      return <SkeletonNotificationItem count={count} />;
    }

    case "detailPage":
      return <SkeletonDetailPage height={height} />;

    default: {
      return <Spinner />;
    }
  }
};

export default SkeletonLoading;
