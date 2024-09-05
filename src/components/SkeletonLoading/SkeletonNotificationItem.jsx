import React from "react";
import Skeleton from "react-loading-skeleton";
import { ListGroupItem } from "reactstrap";

const SkeletonNotificationItem = ({ count }) => {
    return (
      <>
        {/* <p className="notificationDay">
          <Skeleton height={13} width={90} />
        </p> */}
  
        {[...Array(count)].map((_, index) => (
          <ListGroupItem
            className={"notificationsWrap"}
            key={`SkeletonNotificationItem_${index}`}
          >
            <div className="notifications">
              <Skeleton circle height={50} width={50} className="mr-1" />
  
              <div className="mt-1">
                <span>
                  <Skeleton
                    height={14}
                    width={Math.floor(Math.random() * 235 + 230)}
                    className="mr-3"
                  />
                </span>
              </div>
            </div>
          </ListGroupItem>
        ))}
      </>
    );
  };
  
  export default SkeletonNotificationItem;