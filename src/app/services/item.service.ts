import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Item, PagedResponse } from '../models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ItemService {

    private readonly API_URL = environment.apiURL;

    constructor(private httpClient: HttpClient) { }

    getAllItems(payload: any): Observable<PagedResponse> {
        return this.fetchItems(this.API_URL, payload);
    }

    getItemById(id: string): Observable<Item> {
        return this.httpClient.get<Item>(`${this.API_URL}/${id}`);
    }

    searchItem(name: string, payload: any): Observable<PagedResponse> {
        const url = `${this.API_URL}/?name=${name}`;
        return this.fetchItems(url, payload);
    }

    createItem(item: Item): Observable<Item> {
        return this.httpClient.post<Item>(`${this.API_URL}`, item);
    }

    updateItem(id: string, item: Item): Observable<Item> {
        return this.httpClient.put<Item>(`${this.API_URL}/${id}`, item);
    }

    deleteItem(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
    }

    private fetchItems(url: string, payload?: any): Observable<PagedResponse> {
        const countRequest = this.httpClient.get<Item[]>(url);
        const paginatedRequest = this.httpClient.get<Item[]>(url, {
            params: payload
        });

        return forkJoin([countRequest, paginatedRequest]).pipe(
            map(([allItems, paginatedItems]) => ({
                totalCount: allItems.length,
                items: paginatedItems
            }))
        );
    }
}
