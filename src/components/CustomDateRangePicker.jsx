import React, { useState } from "react";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { Input } from "reactstrap";
import { dateConfig } from "../config/helper-config";

const CustomDateRangePicker = ({
  startDate,
  startDateId,
  endDate,
  endDateId,
  maxDate,
  isDisabledOutsideRange = false,
  isMaxDateValidation = false,
  isDisabledPreviousRange = false,
  disabled = false,
  onDatesChange = () => {},
  isShowDateType = true,
  dateType = "",
}) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const _maxDateValidation = () => {
    if (isMaxDateValidation && maxDate) {
      return moment(maxDate);
    }
    return moment();
  };

  const _minDateValidation = () => {
    return moment();
  };

  const _onDatesChange = ({ startDate, endDate, dateType }) => {
    if (startDate) {
      startDate = moment(startDate).utcOffset(0);
      startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    if (endDate) {
      endDate = moment(endDate).utcOffset(0);
      endDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    onDatesChange({ startDate, endDate, dateType });
  };

  const _onChangeDateType = (value) => {
    switch (value) {
      case "last7days": {
        const startDate = moment().subtract(6, "d");
        const endDate = moment();

        _onDatesChange({ startDate, endDate, dateType: "last7days" });
        break;
      }
      case "last4weeks": {
        const startDate = moment().subtract(3, "w");
        const endDate = moment();

        _onDatesChange({ startDate, endDate, dateType: "last4weeks" });
        break;
      }
      case "lastmonth": {
        const startDate = moment().subtract(1, "month").startOf("month");
        const endDate = moment().subtract(1, "month").endOf("month");

        _onDatesChange({ startDate, endDate, dateType: "lastmonth" });
        break;
      }
      case "last3months": {
        const startDate = moment().subtract(2, "month").startOf("month");
        const endDate = moment();

        _onDatesChange({ startDate, endDate, dateType: "last3months" });
        break;
      }
      case "last12months": {
        const startDate = moment().subtract(11, "month").startOf("month");
        const endDate = moment();

        _onDatesChange({ startDate, endDate, dateType: "last12months" });
        break;
      }
      case "lastyear": {
        const startDate = moment().subtract(1, "year").startOf("year");
        const endDate = moment().subtract(1, "year").endOf("year");

        _onDatesChange({ startDate, endDate, dateType: "lastyear" });
        break;
      }
      case "custom": {
        _onDatesChange({ startDate: null, endDate: null, dateType: "custom" });
        setFocusedInput("startDate");
        break;
      }
      default: {
        console.log({ value });
        _onDatesChange({ startDate: null, endDate: null, dateType: "" });
      }
    }
  };

  return (
    <>
      <div className="dateRangeWithDropDown">
        {isShowDateType ? (
          <Input
            type="select"
            value={dateType}
            name="dateType"
            className={`${dateType === "custom" ? "me-3" : ""}`}
            disabled={disabled}
            onChange={(e) => _onChangeDateType(e.target.value)}
          >
            <option value="">All Time</option>
            {dateConfig.map((each) => (
              <option key={each.value} value={each.value}>
                {each.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </Input>
        ) : null}

        {(isShowDateType === false || dateType === "custom") && (
          <DateRangePicker
            startDate={
              startDate
                ? typeof startDate === "string"
                  ? moment(startDate)
                  : startDate
                : null
            } // momentPropTypes.momentObj or null,
            startDateId={`startDateId_${startDateId}`} // PropTypes.string.isRequired,
            endDate={
              endDate
                ? typeof endDate === "string"
                  ? moment(endDate)
                  : endDate
                : null
            } // momentPropTypes.momentObj or null,
            endDateId={`endDateId_${endDateId}`} // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => {
              onDatesChange({ startDate, endDate, dateType: "custom" });
            }} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={(newFocusInput) => setFocusedInput(newFocusInput)}
            isOutsideRange={(day) =>
              isDisabledPreviousRange
                ? moment().subtract(1, "d").endOf("day").diff(day) >= 0
                : isDisabledOutsideRange || (isMaxDateValidation && maxDate)
                ? moment().endOf("day").diff(day) <= 0 ||
                  (isMaxDateValidation &&
                    maxDate &&
                    moment(day) > _maxDateValidation())
                : null
            }
            maxDate={isDisabledOutsideRange ? _maxDateValidation() : null}
            minDate={isDisabledPreviousRange ? _minDateValidation() : null}
            numberOfMonths={1}
            hideKeyboardShortcutsPanel={true}
            disabled={disabled}
          />
        )}
      </div>
    </>
  );
};

export default CustomDateRangePicker;
