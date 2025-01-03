import React, { useContext, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { AppContext, IAppInterfaces } from "../AppProvider";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, mergeClasses } from "@fluentui/react-components";
import EditableSubCategoryHeader from "./EditableSubCategoryHeader";
import EditableSubCategoryPanel from "./EditableSubCategoryPanel";
import ICategory from "../../models/ICategory";
import AddSubCategoryButton from "./AddSubCategoryButton";
import ISubCategory from "../../models/ISubCategory";

const useStyles = makeStyles({
  AccordionItem: {
    position: "relative"
  },
  AccordionHeader: {
    width: "fit-content",
    maxWidth: "calc(100% - 20px)",
    "& > button": {
      minHeight: "auto",
      margin: 0,
      padding: 0
    }
  },
  AccordionPanel: {
    margin: 0,
    padding: 0
  },
  subCategory: {
    margin: "0 50px 0 0",
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

const EditableCategoryPanel: React.FC<CategoryPanelProps> = ({ category }) => {
  const { dataStore }: IAppInterfaces = useContext(AppContext);
  const styles = useStyles();

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const handleAddSubCategory = (newSubCategory: ISubCategory) => {
    setOpenItemId(newSubCategory.id);
  };

  const handleToggle = (_event: any, data: { openItems: string[] }) => {
    // Als er een item wordt geopend, stel dat in als het openItemId
    // Als alle items worden gesloten, stel openItemId in op null
    setOpenItemId(data.openItems.length > 0 ? data.openItems[0] : null);
  };

  return (
    <>
      <Accordion
        data-testid="editable-category-panel"
        collapsible
        multiple={false}
        openItems={openItemId ? [openItemId] : []}
        onToggle={handleToggle}
      >
        {dataStore.getSubCategoriesByParentId(category.id).map((subCategory) => (
          <>
            <AccordionItem
              key={subCategory.id}
              value={subCategory.id}
              style={{ padding: 0 }}
              className={mergeClasses(styles.AccordionItem)}
            >
              <AccordionHeader
                expandIcon={null}
                className={mergeClasses(styles.AccordionHeader, styles.subCategory, "sub-category")}
                data-testid={subCategory.id}
              >
                <EditableSubCategoryHeader subCategory={subCategory} color={category.color} />
              </AccordionHeader>
              <AddSubCategoryButton id={subCategory.id} onAdd={handleAddSubCategory} buttonType="subCategory" />
              <AccordionPanel className={styles.AccordionPanel}>
                <EditableSubCategoryPanel
                  key={subCategory.id}
                  subCategory={subCategory}
                  canDelete={dataStore.getSubCategoriesByParentId(subCategory.id).length === 0}
                />
              </AccordionPanel>
            </AccordionItem>

            {dataStore.getSubCategoriesByParentId(subCategory.id).map((subSubCategory) => (
              <AccordionItem key={subSubCategory.id} value={subSubCategory.id}>
                <AccordionHeader
                  expandIcon={null}
                  className={mergeClasses(styles.AccordionHeader, styles.subSubCategory, "sub-category")}
                  data-testid={subSubCategory.id}
                >
                  <EditableSubCategoryHeader subCategory={subSubCategory} color={category.color} />
                </AccordionHeader>
                <AccordionPanel className={styles.AccordionPanel}>
                  <EditableSubCategoryPanel key={subSubCategory.id} subCategory={subSubCategory} />
                </AccordionPanel>
              </AccordionItem>
            ))}
          </>
        ))}
      </Accordion>
      <AddSubCategoryButton id={category.id} onAdd={handleAddSubCategory} buttonType="category" />
    </>
  );
};

export default EditableCategoryPanel;
