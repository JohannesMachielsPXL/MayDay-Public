import React, { useContext, useState } from "react";
import ISubCategory from "../../models/ISubCategory";
import { AppContext } from "../AppProvider";
import { Button, Field, Input, makeStyles, Textarea } from "@fluentui/react-components";
import { ArrowResetRegular, DeleteRegular, SaveRegular } from "@fluentui/react-icons";
import { mergeStyles } from "@fluentui/react";

const useStyles = makeStyles({
  box: {
    margin: "5px 0 0 0",
    padding: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap"
  },
  field: {
    padding: 0,
    margin: "3px 0",
    width: "100%"
  },
  buttonDelete: {
    color: "red"
  }
});

interface EditableSubCategoryPanelProps {
  subCategory: ISubCategory;
  canDelete?: boolean;
}

const EditableSubCategoryPanel: React.FC<EditableSubCategoryPanelProps> = ({ subCategory, canDelete = true }) => {
  const { dataStore } = useContext(AppContext);
  const styles = useStyles();

  const [name, setName] = useState(subCategory.name);
  const [feedback, setFeedback] = useState(subCategory.feedback);

  const clickSave = () => {
    const updatedSubCategory: ISubCategory = { ...subCategory, name, feedback };
    void dataStore.editSubCategory(subCategory.id, updatedSubCategory);
  };

  const clickReset = () => {
    setName(subCategory.name);
    setFeedback(subCategory.feedback);
  };

  return (
    <>
      <div className={styles.box}>
        <Field size="small" className={styles.field}>
          <Input data-testid="edit-sub-category-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Textarea
          data-testid="edit-sub-category-feedback"
          className={styles.field}
          placeholder="Feedback"
          resize="vertical"
          size="small"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button
          data-testid="cancel-edit-sub-category"
          appearance="subtle"
          size="medium"
          icon={<ArrowResetRegular />}
          onClick={clickReset}
        />
        <Button
          data-testid="save-edit-sub-category"
          appearance="subtle"
          size="medium"
          icon={<SaveRegular />}
          onClick={clickSave}
        />
        <Button
          data-testid="delete-sub-category"
          appearance="subtle"
          className={mergeStyles(styles.buttonDelete)}
          size="medium"
          disabled={!canDelete}
          icon={<DeleteRegular />}
          onClick={() => void dataStore.deleteSubCategory(subCategory.id)}
        />
      </div>
    </>
  );
};

export default EditableSubCategoryPanel;
