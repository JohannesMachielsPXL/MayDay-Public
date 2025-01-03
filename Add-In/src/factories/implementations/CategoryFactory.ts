import {injectable} from "inversify";
import ICategoryFactory, {ICategoryData} from "../ICategoryFactory";
import ICategory from "../../models/ICategory";

@injectable()
export default class CategoryFactory implements ICategoryFactory {

    create(data: ICategoryData): ICategory {
        return {
            id: data.id,
            name: data.name,
            color: data.color,
            ref: data.ref
        }
    }
}
