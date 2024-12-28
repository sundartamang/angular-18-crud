import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="submit" [disabled]="shouldDisable " [ngClass]="className"
        class="py-2 px-4 border focus:outline-none rounded-md" (click)="handleClick()">
        <ng-content select="[icon]"></ng-content>
        {{ text }}
    </button>
  `,
})
export class ButtonComponent {
  @Input() text!: string;
  @Input() className!: string;
  @Input() shouldDisable: boolean = false;
  @Output() action = new EventEmitter<void>();

  handleClick(): void {
    this.action.emit();
  }
}
