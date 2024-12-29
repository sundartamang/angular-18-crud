import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '../button/button.component';
import { Item } from '../../models';

type DialogData = {
  title: string,
  item?: Item
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  itemForm!: FormGroup;
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<FormComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    this.editMode = !!this.data.item;
    this.formInitializer();
    if (this.data.item) {
      this.patchFormValue();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.itemForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters.`;
    if (field.errors['maxlength']) return `${fieldName} cannot exceed ${field.errors['maxlength'].requiredLength} characters.`;
    if (field.errors['min']) return `${fieldName} must be greater than or equal to ${field.errors['min'].min}.`;
    if (field.errors['max']) return `${fieldName} must be less than or equal to ${field.errors['max'].max}.`;
    return 'Invalid input.';
  }
  
  submitData(): void {
    const data = this.itemForm.getRawValue();
    this.dialogRef.close(data);
    this.resetItemForm();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  private formInitializer(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      description: [''],
    });
  }

  private patchFormValue(): void {
    this.itemForm.patchValue({ ...this.data.item });
  }

  private resetItemForm(): void {
    this.itemForm.reset();
  }
}
