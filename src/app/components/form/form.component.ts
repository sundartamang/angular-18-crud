import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent } from '../button/button.component';
import { Item } from '../../models';

type DIALOG_DATA = {
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

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<FormComponent>,
    @Inject(DIALOG_DATA) public data: DIALOG_DATA
  ) {
    this.formInitializer();
    if (this.data.item) {
      this.patchFormValue();
    }
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