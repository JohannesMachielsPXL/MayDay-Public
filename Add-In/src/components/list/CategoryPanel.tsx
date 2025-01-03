import React, { useContext } from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { AppContext, IAppInterfaces } from "../AppProvider";
import ICategory from "../../models/ICategory";
import SubCategory from "./SubCategory";

const useStyles = makeStyles({
  subCategory: {
    margin: "0 20px 0 0",
    padding: "0"
  },
  subSubCategory: {
    margin: "0 0 0 20px",
    padding: "0"
  }
});

interface CategoryPanelProps {
  category: ICategory;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ category }) => {
  const { dataStore }: IAppInterfaces = useContext(AppContext);
  const styles = useStyles();

  return (
    <>
      {dataStore.getSubCategoriesByParentId(category.id).map((subCategory) => (
        // SubCategories
        <>
          <div data-testid={subCategory.id} className={mergeClasses(styles.subCategory, "sub-category")}>
            <SubCategory subCategory={subCategory} color={category.color} />
          </div>

          {dataStore.getSubCategoriesByParentId(subCategory.id).map((subSubCategory) => (
            // SubSubCategories
            <div data-testid={subSubCategory.id} key={subSubCategory.id} className={mergeClasses(styles.subSubCategory, "sub-category")}>
              <SubCategory subCategory={subSubCategory} color={category.color} />
            </div>
          ))}
        </>
      ))}
    </>
  );
};

export default CategoryPanel;
