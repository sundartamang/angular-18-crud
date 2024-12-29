import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '../button/button.component';

type ConfirmationModel  ={
  title?: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonComponent],
  template: `
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white shadow-lg max-w-md w-full relative">
        <div class="p-5 flex justify-between bg-primary-dark  border-b border-blue-gray-100">
            <p class="text-m text-white">{{ data.title }}</p>
            <a (click)="closeModal()">
                <span icon><i class="fa-solid fa-xmark text-white"></i></span>
            </a>
        </div>
        <div class="p-5 text-sm">
            <div [innerHTML]="data.message"></div>
        </div>
        <div class="py-2 px-5 flex justify-between bg-primary-light-dark">
            <app-button text="No" className="bg-gray-200 text-gray-700 text-sm shadow-sm border border-border-light"  (action)="closeModal()"></app-button>
            <app-button text="Yes" className="bg-primary-green text-gray-700 text-sm shadow-sm border border-border-light"  (action)="confirm()"></app-button>
        </div>
    </div>
</div>`,
})
export class ConfirmDialogComponent {

  constructor(@Inject(DIALOG_DATA) public data: ConfirmationModel,
    private ref: DialogRef<any>) { this.ref.disableClose = true; }

  closeModal() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }
}
