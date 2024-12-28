import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent, NotificationComponent } from './components';
import { NotificationService } from './services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, NotificationComponent],
  template: `
    <app-loader />
    <router-outlet />
    <app-notification 
    [showNotification]="showNotification" 
    [message]="message" 
    [isError]="isError"
    (close)="showNotification = false">
    </app-notification>
  `,
})
export class AppComponent implements OnDestroy {

  title = 'angular-crud';
  message: string = '';
  isError: boolean = true;
  showNotification: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {
    this.listenForNotification();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenForNotification(): void {
    this.notificationService.notification$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(notification => {
      this.message = notification.message;
      this.isError = notification.isError;
      this.showNotification = true;

      if (!this.isError) { this.hideNotification(); }
    });
  }

  private hideNotification(): void {
    setTimeout(() => {
      this.showNotification = false;
    }, 10000)
  }

}
