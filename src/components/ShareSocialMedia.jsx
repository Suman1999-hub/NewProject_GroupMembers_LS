import React, { useState } from "react";
import { Button, Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { copyToClipboard, shareLinkOnSocialMedia } from "../helper-methods";
import SvgIcons from "./SvgIcons";
import CustomTooltip from "./custom/CustomTooltip";

const ShareSocialMedia = ({
  id = "",
  link = "",
  isShareOnSocialMedia = true,
}) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const _toggleIsOpenPopover = () => {
    setIsOpenPopover((prev) => !prev);
  };

  return (
    <>
      {isShareOnSocialMedia && (
        <Button
          color="link"
          id={`ShareSocialMedia_share_${id}`}
          onClick={() => _toggleIsOpenPopover()}
        >
          <SvgIcons type={"share"} />
          <CustomTooltip
            text={`Share`}
            target={`ShareSocialMedia_share_${id}`}
          />
        </Button>
      )}

      <Button
        color="link"
        id={`copy_${id}`}
        onClick={() => copyToClipboard(link)}
      >
        <SvgIcons type="copy" />
        <CustomTooltip text={`Copy`} target={`copy_${id}`} />
      </Button>

      {isShareOnSocialMedia && (
        <Popover
          isOpen={isOpenPopover}
          target={`ShareSocialMedia_share_${id}`}
          toggle={() => _toggleIsOpenPopover()}
          trigger="legacy"
        >
          <PopoverHeader>Share</PopoverHeader>
          <PopoverBody>
            <Button
              color="link"
              id={`whatsapp_${id}`}
              onClick={() => shareLinkOnSocialMedia({ type: "whatsapp", link })}
            >
              <SvgIcons type="whatsapp" />
              <CustomTooltip text={`Whatsapp`} target={`whatsapp_${id}`} />
            </Button>
            <Button
              color="link"
              id={`telegram_${id}`}
              onClick={() => shareLinkOnSocialMedia({ type: "telegram", link })}
            >
              <SvgIcons type="telegram" />
              <CustomTooltip text={`Telegram`} target={`telegram_${id}`} />
            </Button>
            <Button
              color="link"
              id={`instagram_${id}`}
              onClick={() =>
                shareLinkOnSocialMedia({ type: "instagram", link })
              }
            >
              <SvgIcons type="instagram" />
              <CustomTooltip text={`Instagram`} target={`instagram_${id}`} />
            </Button>
            <Button
              color="link"
              id={`facebook_${id}`}
              onClick={() => shareLinkOnSocialMedia({ type: "facebook", link })}
            >
              <SvgIcons type="facebook" />
              <CustomTooltip text={`Facebook`} target={`facebook_${id}`} />
            </Button>
            <Button
              color="link"
              id={`twitter_${id}`}
              onClick={() => shareLinkOnSocialMedia({ type: "twitter", link })}
            >
              <SvgIcons type="twitter" />
              <CustomTooltip text={`Twitter`} target={`twitter_${id}`} />
            </Button>
            <Button
              color="link"
              id={`linkedin_${id}`}
              onClick={() => shareLinkOnSocialMedia({ type: "linkedin", link })}
            >
              <SvgIcons type="linkedin" />
              <CustomTooltip text={`LinkedIn`} target={`linkedin_${id}`} />
            </Button>
            {/* <Button
            color="link"
            id={`email_${id}`}
            onClick={() => shareLinkOnSocialMedia({ type: "email", link })}
          >
            <SvgIcons type="email" />
            <CustomTooltip text={`Email`} target={`email_${id}`} />
          </Button> */}
          </PopoverBody>
        </Popover>
      )}
    </>
  );
};

export default ShareSocialMedia;
