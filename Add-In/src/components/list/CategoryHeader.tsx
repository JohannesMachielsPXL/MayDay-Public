import React from "react";
import ICategory from "../../models/ICategory";

interface CategoryHeaderProps {
  category: ICategory;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  return (
    <>
      <h2 data-testid="category-header-name">{category.name}</h2>
    </>
  );
};

export default CategoryHeader;
