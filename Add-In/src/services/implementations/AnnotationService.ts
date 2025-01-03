import { injectable } from "inversify";
import IAnnotationService from "../IAnnotationService";
@injectable()
export default class AnnotationService implements IAnnotationService {
  
  // This method is used to insert feedback in the document
  // The style of the feedback is determined by the feedbackStyleName from IStyleService (which is always the same for now)
  insertFeedback = async(feedbackStyleName:string, feedback: string, categoryRef: string): Promise<void> =>  {
    await Word.run(async (context) => {

        const selection = context.document.getSelection();
        const styles = context.document.getStyles();
      styles.load("getByNameOrNullObject");
      await context.sync();

      let feedbackStyle = styles.getByNameOrNullObject(feedbackStyleName);
      feedbackStyle.load("isNullObject");
      await context.sync();
  
        if (!feedbackStyle.isNullObject) {
            const feedbackText = `[${categoryRef}] ${feedback}`;
          const test = 
          selection.insertText(feedbackText, "After");
          test.style = feedbackStyleName;
          await context.sync();
        }
      }).catch((error) => {
        console.error(error);
      });
  }
  // This method is used to highlight the selected text in the document
  // The style of the highlight is determined by the styleName from IStyleService
   highlightSelectedText = async (styleName:string): Promise<void> => {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();
     const styles = context.document.getStyles();
     styles.load("getByNameOrNullObject");
     await context.sync();

     let highlightStyle = styles.getByNameOrNullObject(styleName);
     highlightStyle.load("isNullObject");
     await context.sync();
 
       if (!highlightStyle.isNullObject) {
         selection.style = styleName;
         await context.sync();
       }
    }).catch((error) => {
      console.error(error);
    });
  }

  

  async removeHighlightFromSelectedText() {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();

      let categoryName = "noStyle";

      const styles = context.document.getStyles();
      styles.load("getByNameOrNullObject");
      await context.sync();

      let categoryStyle = styles.getByNameOrNullObject(categoryName);
      categoryStyle.load("isNullObject");
      await context.sync();

      if (categoryStyle.isNullObject) {
        categoryStyle = context.document.addStyle(categoryName, "Character");
        categoryStyle.font.color = "black";
        categoryStyle.shading.backgroundPatternColor = null;
      }
      selection.style = categoryName;

      await context.sync();
    }).catch((error) => {
      console.error(error);
    });
  }
}
