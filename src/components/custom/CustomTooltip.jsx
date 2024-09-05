import React, { useState } from "react";
import { Tooltip } from "reactstrap";

const CustomTooltip = ({
  // className = "",
  text = "",
  target = "",
  placement = "bottom",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!text || !target) {
    return <></>;
  }

  return (
    <Tooltip
      placement={placement}
      isOpen={isOpen}
      target={target}
      toggle={() => setIsOpen((prev) => !prev)}
      // className={className}
    >
      {text}
    </Tooltip>
  );
};

export default CustomTooltip;
