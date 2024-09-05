import React from "react";

const PublicFooter = () => {
  return (
    <>
      <div className="projectFooter authFooter">

        <p>© 2022 Project Name.</p>

        <div className="copyright">
          <p>Powered By</p>
          <a
            href="https://www.logic-square.com"
            target="_blank"
            rel="noreferrer"
            className="ms-2 lsLink"
          >
            Logic Square
          </a>
        </div>

      </div>
    </>
  )
};

export default PublicFooter;
