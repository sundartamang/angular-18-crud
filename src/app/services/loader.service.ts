import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private loaderSubject = new BehaviorSubject<boolean>(false);
    loader$ = this.loaderSubject.asObservable();

    showLoader() {
        this.loaderSubject.next(true);
    }

    hideLoader() {
        this.loaderSubject.next(false);
    }
}
