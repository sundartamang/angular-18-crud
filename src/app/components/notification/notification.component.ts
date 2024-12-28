import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showNotification && message" [ngClass]="{'bg-red-500': isError, 'bg-green-500': !isError}"
        class="rounded-lg shadow-lg max-w-md w-full absolute bottom-5 left-1/2 transform -translate-x-1/2 p-3 flex items-center justify-between text-white z-50">
      <span class="text-sm text-center">{{ message }}</span>
      <button (click)="closeNotification()" class="text-gray-800 bg-white px-3 py-1 rounded-md text-sm sm:px-4 sm:py-2">close</button>
    </div>
  `,
})
export class NotificationComponent {
  @Input() showNotification: boolean = false;
  @Input() message: string = '';
  @Input() isError: boolean = true;
  @Output() close = new EventEmitter<void>();

  closeNotification(): void {
    this.close.emit();
  }
}
