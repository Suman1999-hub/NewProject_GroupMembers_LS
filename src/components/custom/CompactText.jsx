import React, { useMemo } from "react";
import { capitalize, copyToClipboard } from "../../helper-methods";
import CustomTooltip from "./CustomTooltip";

const CompactText = ({ text = "", length = 25, isCopy = false }) => {
  const id = useMemo(() => {
    return Math.floor(Math.random() * 1000000);
  }, []);

  if (!text || text === "-" || text === "Not provided" || text === "N/A") {
    return text || "";
  }

  return (
    <>
      {text?.length > length ? (
        <>
          <span
            className="cursorPointer"
            id={`CustomTooltip_CompactText_${id}`}
            onClick={() => (isCopy ? copyToClipboard(text) : {})}
          >
            {capitalize(text).substring(0, length - 3) + "..."}
          </span>

          <CustomTooltip
            target={`CustomTooltip_CompactText_${id}`}
            text={capitalize(text)}
          />
        </>
      ) : (
        <>
          <span
            className={isCopy ? "cursorPointer" : ""}
            onClick={() => (isCopy ? copyToClipboard(text) : {})}
          >
            {capitalize(text)}
          </span>
        </>
      )}
    </>
  );
};

export default CompactText;
