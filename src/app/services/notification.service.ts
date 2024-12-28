import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<{ message: string; isError: boolean }>({ message: '', isError: true });

    notification$ = this.notificationSubject.asObservable();

    public showNotification(message: string, isError: boolean = true): void {
        this.notificationSubject.next({ message, isError });
    }
}
