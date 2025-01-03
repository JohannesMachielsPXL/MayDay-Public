import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  makeStyles,
  mergeClasses,
  ToggleButton
} from "@fluentui/react-components";
import CategoryHeader from "./CategoryHeader";
import CategoryPanel from "./CategoryPanel";
import { AppContext, IAppInterfaces } from "../AppProvider";
import IObserver from "../../patterns/IObserver";
import ICategory from "../../models/ICategory";
import CategoryFeedback from "./CategoryFeedback";
import EditableCategoryPanel from "./EditableCategoryPanel";
import { EditFilled, EditRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  AccordionHeader: {
    borderRadius: 0,
    margin: 0
  },
  ToggleButton: {
    aspectRatio: "1 / 1",
    border: 0
  }
});

const CategoryList: React.FC = () => {
  const { dataStore }: IAppInterfaces = useContext(AppContext);
  const styles = useStyles();

  const [categories, setCategories] = React.useState<ICategory[]>(dataStore.getCategories());
  const [version, setVersion] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  const toggleEditable = () => {
    setIsEditable((prevIsEditable) => !prevIsEditable);
  };

  useEffect(() => {
    const observer: IObserver = {
      update: () => {
        setCategories(dataStore.getCategories());
        setVersion((prevVersion) => prevVersion + 1); // Force re-render
      }
    };

    dataStore.registerObserver(observer);

    // Cleanup function to remove observer when component unmounts
    return () => {
      dataStore.removeObserver(observer);
    };
  }, []);

  return (
    <>
      <ToggleButton
        data-testid="toggle-editable"
        className={mergeClasses("floating-button", styles.ToggleButton)}
        onClick={toggleEditable}
        shape="circular"
        size="large"
        style={isEditable ? { color: "white", backgroundColor: "red" } : {}}
        icon={isEditable ? <EditRegular /> : <EditFilled />}
      />
      <Accordion collapsible className="accordion">
        {categories.map((category, index) => (
          <AccordionItem key={category.id} value={index} className="accordion-item">
            <AccordionHeader
              className={mergeClasses(styles.AccordionHeader, "accordion-header")}
              style={{ backgroundColor: category.color }}
              key={version}
              data-testid={category.id}
            >
              <CategoryHeader key={category.id} category={category} />
            </AccordionHeader>
            <AccordionPanel style={{ margin: 0 }} className="accordion-panel">
              {!isEditable ? (
                <>
                  <CategoryFeedback category={category} />
                  <CategoryPanel data-testid="category-panel" category={category} />
                </>
              ) : (
                <EditableCategoryPanel category={category} />
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default CategoryList;
