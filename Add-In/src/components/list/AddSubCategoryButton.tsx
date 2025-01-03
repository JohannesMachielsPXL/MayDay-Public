import React, { useContext } from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { AppContext } from "../AppProvider";
import ISubCategory from "../../models/ISubCategory";
import { AddRegular } from "@fluentui/react-icons";
import Guid from "../../factories/Guid";

const useStyles = makeStyles({
  ButtonCategory: {
    display: "block",
    margin: "5px auto 0 auto"
  },
  ButtonSubCategory: {
    position: "absolute",
    right: "-10px",
    top: "-1px"
  }
});

interface AddSubCategoryButtonProps {
  id: string;
  onAdd: (newSubCategory: ISubCategory) => void;
  buttonType: "category" | "subCategory";
}

const AddSubCategoryButton: React.FC<AddSubCategoryButtonProps> = ({ id, onAdd, buttonType }) => {
  const { dataStore, subCategoryFactory } = useContext(AppContext);
  const styles = useStyles();

  const clickAdd = async () => {
    const newSubCategory: ISubCategory = subCategoryFactory.create({
      id: Guid.newGuid(),
      parentId: id,
      name: "",
      feedback: ""
    });
    await dataStore.addSubCategory(newSubCategory);
    onAdd(newSubCategory);
  };

  return (
    <>
      {buttonType === "category" && (
        <Button
          data-testid={`create-subcategory-from-category-${id}`}
          className={styles.ButtonCategory}
          appearance="transparent"
          size="small"
          icon={<AddRegular />}
          onClick={() => void clickAdd()}
        />
      )}
      {buttonType === "subCategory" && (
        <Button
          data-testid={`create-subcategory-from-subcategory-${id}`}
          className={styles.ButtonSubCategory}
          appearance="transparent"
          size="medium"
          icon={<AddRegular />}
          onClick={() => void clickAdd()}
        />
      )}
    </>
  );
};

export default AddSubCategoryButton;
