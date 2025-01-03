import { injectable } from "inversify";
import IStyleService from "../IStyleService";
//import RequestContext = Word.RequestContext;
import ICategory from "../../models/ICategory";

@injectable()
export default class StyleService implements IStyleService {

    getStyleName = async (category:ICategory): Promise<string> => {
        return await Word.run(async (context) => {
            const styleName = `mayday-${category.id}`;
            const styles = context.document.getStyles();
            styles.load("getByNameOrNullObject");
            await context.sync();
      
            let categoryStyle = styles.getByNameOrNullObject(styleName);
            categoryStyle.load("isNullObject");
            await context.sync();
      
            if (categoryStyle.isNullObject) {
              categoryStyle = context.document.addStyle(styleName, "Character");
              categoryStyle.font.color = "black";
              categoryStyle.shading.backgroundPatternColor = category.color;
            }

            await context.sync();
            return styleName;
          }).catch((error) => {
            console.error(error);
            return null;
          });
        
    }

   getFeedbackStyleName = async() : Promise<string> => {
        return await Word.run(async (context) => {
            let feedbackStyleName = "feedbackStyle";
            const styles = context.document.getStyles();
            let feedbackStyle = styles.getByNameOrNullObject(feedbackStyleName);
            feedbackStyle.load("isNullObject");
            await context.sync();
            if (feedbackStyle.isNullObject) {
              feedbackStyle = context.document.addStyle(feedbackStyleName, "Character");
              feedbackStyle.font.color = "red";
              feedbackStyle.font.italic = true;
            }
            console.log(feedbackStyleName);
            return feedbackStyleName;
          }).catch((error) => {
            console.error(error);
            return null;
        });
    }

}