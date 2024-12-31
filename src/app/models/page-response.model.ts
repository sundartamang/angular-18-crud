import { Item } from "./item.model";

export interface PagedResponse {
    items: Item[];
    totalCount: number;
}
