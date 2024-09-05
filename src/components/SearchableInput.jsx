import React from "react";
import ReactSelect from "react-select";

const SearchableInput = ({
  options,
  value,
  onChange,
  onBlur,
  className,
  disabled = false,
  isMulti = false,
}) => {
  const _onBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <ReactSelect
      options={options}
      value={value}
      onChange={onChange}
      onBlur={_onBlur}
      isDisabled={disabled}
      placeholder="Select..."
      className={`react-select-container ${className}`}
      classNamePrefix="react-select"
      isMulti={isMulti}
      menuPlacement="auto"
      // menuIsOpen={true}
    />
  );
};

export default SearchableInput;
