import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonTable = ({ row, col, height = undefined, width = undefined }) => {
  return (
    <>
      {[...Array(row)].map((_, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
          {[...Array(col)].map((_, colIndex) => (
            <td key={`col-${rowIndex}-${colIndex}`}>
              <Skeleton
                {...(height ? { height } : {})}
                {...(width ? { width } : {})}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default SkeletonTable;
