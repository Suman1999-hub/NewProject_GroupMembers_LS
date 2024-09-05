import React, { Component } from "react";
import { Oval } from "react-loader-spinner";
import { connect } from "react-redux";
import ColorVariables from "../assets/styles/scss/index.scss";

class FullPageLoader extends Component {
  render() {
    const { loaderData } = this.props;

    if (loaderData?.isVisible) {
      return (
        <div className="fullPgLoaderWrap">
          <div className="loaderWrap">
            <Oval color={ColorVariables?.primary || "#3498DB"} />
            {loaderData?.loaderText ? (
              <p>
                {typeof loaderData.loaderText === "string"
                  ? loaderData.loaderText
                  : "Loading..."}
              </p>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      );
    } else {
      return <React.Fragment />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    loaderData: state.loaderData,
  };
};

export default connect(mapStateToProps, null)(FullPageLoader);
