import React, {useEffect, useState,useContext} from "react";
import {Button} from "@fluentui/react-components";
import ICategory from "../../models/ICategory";
import {AppContext, IAppInterfaces} from "../AppProvider";

interface CategoryFeedbackProps {
    category: ICategory,
}
// Samenhang : 
// IStyleService voor het ophalen/maken van de stijl => IAnnotationService voor het toepassen van de stijl op de tekst

const CategoryFeedback: React.FC<CategoryFeedbackProps> = ({category}) => {
    const {annotationService,styleService} : IAppInterfaces = useContext(AppContext);
    const [feedback, setFeedback] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>(category.name);

    const submitFeedback = async () => {
        //stijl halen van de catId
        console.log("submitFeedback");
        const style = await styleService.getStyleName(category);     
        await annotationService.highlightSelectedText(style);

        const feedbackStyle = await styleService.getFeedbackStyleName(); 
        await annotationService.insertFeedback(feedbackStyle,feedback, category.ref);
    }

    return (
        <div data-testid="category-feedback" className="accordion-feedback">
            <textarea className="category-feedback-text" placeholder="Vrije Commentaar" onChange={(e) => setFeedback("[ " + e.target.value + " ] ")}></textarea>
            <Button onClick={submitFeedback}>Toevoegen</Button>
        </div>
    );
}

export default CategoryFeedback;