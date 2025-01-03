import React, { useContext, useState } from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { AppContext } from "../AppProvider";
import ISubCategory from "../../models/ISubCategory";

const useStyles = makeStyles({
  Button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: "1px 10px"
  }
});

interface EditableSubCategoryHeaderProps {
  subCategory: ISubCategory;
  color: string;
}

const EditableSubCategoryHeader: React.FC<EditableSubCategoryHeaderProps> = ({ subCategory, color }) => {
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
      <Button
        data-testid="edit-sub-category-header-name"
        shape="circular"
        className={styles.Button}
        style={hovered ? hoverStyle : buttonStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {subCategory.name === "" ? "..." : subCategory.name}
      </Button>
    </>
  );
};

export default EditableSubCategoryHeader;
