import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Item } from '../models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ItemService {

    private readonly API_URL = environment.apiURL;

    constructor(private httpClient: HttpClient) { }

    getAllItems(payload: any): Observable<{ items: Item[], totalCount: number }> {
        const countRequest = this.httpClient.get<Item[]>(this.API_URL);
        const paginatedRequest = this.httpClient.get<Item[]>(this.API_URL, {
            params: payload
        });

        const data = [countRequest, paginatedRequest]

        return forkJoin(data).pipe(
            map(([allItems, paginatedItems]) => ({
                totalCount: allItems.length,
                items: paginatedItems
            }))
        );
    }

    getItemById(id: string): Observable<Item> {
        return this.httpClient.get<Item>(`${this.API_URL}/${id}`);
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


    triggerRequest() {
        return this.httpClient.get('https://api.example.com/data');
    }
}
