import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormValidationService {
    
    static getErrorMessage(control: AbstractControl, fieldName: string): string {
        if (!control || !control.errors) return '';
        const errors: ValidationErrors = control.errors;

        if (errors['required']) return `${fieldName} is required.`;
        if (errors['minlength']) return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters.`;
        if (errors['maxlength']) return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
        if (errors['min']) return `${fieldName} must be greater than or equal to ${errors['min'].min}.`;
        if (errors['max']) return `${fieldName} must be less than or equal to ${errors['max'].max}.`;

        return 'Invalid input.';
    }
}
