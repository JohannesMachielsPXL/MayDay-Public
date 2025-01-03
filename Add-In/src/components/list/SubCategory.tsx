import React, { useContext, useState } from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { Tooltip } from "@fluentui/react-components";
import { AppContext } from "../AppProvider";
import ISubCategory from "../../models/ISubCategory";

const useStyles = makeStyles({
  Button: {
    margin: 0,
    padding: "0 10px"
  }
});

interface SubCategoryProps {
  subCategory: ISubCategory;
  color: string;
}

const SubCategory: React.FC<SubCategoryProps> = ({ subCategory, color }) => {
  const { utilityService } = useContext(AppContext);
  const styles = useStyles();

  const [hovered, setHovered] = useState(false);
  const buttonStyle = {
    backgroundColor: utilityService.hexToRgba(color, 0.3),
    border: `2px solid ${utilityService.hexToRgba(color, 0.3)}`,
    minWidth: "auto"
  };
  const hoverStyle = {
    backgroundColor: utilityService.hexToRgba(color, 0.6),
    border: `2px solid ${utilityService.hexToRgba(color, 0)}`,
    minWidth: "auto"
  };

  return (
    <>
      <Tooltip
        withArrow
        content={
          <>
            <div data-testid="sub-category-tooltip-name">{subCategory.name}</div>
            <div>
              <i>{subCategory.feedback}</i>
            </div>
          </>
        }
        relationship="description"
        showDelay={2000}
      >
        <Button
          data-testid="sub-category-name"
          shape="circular"
          className={styles.Button}
          style={hovered ? hoverStyle : buttonStyle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {subCategory.name === "" ? "..." : subCategory.name}
        </Button>
      </Tooltip>
    </>
  );
};

export default SubCategory;
