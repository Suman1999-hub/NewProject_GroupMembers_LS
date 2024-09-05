import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { UploadQueueManager } from "../aws/upload-queue-manager";
// import { onFilePercentageChange } from "../helper-methods/index";

const MediaQueueViewer = () => {
  const [queueCount, setQueueCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    UploadQueueManager.onQueueCountChange((queueCount) => {
      setQueueCount(queueCount);
    });

    // onFilePercentageChange((percentage) => {
    //   setPercentage(percentage !== "100%" ? percentage : 0);
    // });
  }, []);

  return (
    <>
      {queueCount > 0 ? (
        <div id="mediaQueueViewerWrapper">
          <div id="uploadeProgressHeader">
            <Spinner
              style={{
                width: "1.3rem",
                height: "1.3rem",
                marginRight: 12,
              }}
            />
            {queueCount > 1
              ? `${queueCount} uploads in Progress`
              : `${queueCount} upload in Progress`}{" "}
            {percentage ? `${percentage}` : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MediaQueueViewer;
