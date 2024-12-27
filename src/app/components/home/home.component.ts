import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  itemForm!: FormGroup;
  items = signal<Item[]>([]);
  totalCount = signal<number>(0);
  currentPage: number = 1;
  itemsPerPage: number = 5;

  editMode: boolean = false;
  itemId: any;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
  ) {
    this.formInitializer();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onEditItem(item: Item): void {
    this.editMode = true;
    this.itemId = item.id;
    this.itemForm.patchValue({ ...item });
  }

  onDeleteItem(item: Item): void {
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
      this.itemService.deleteItem(item.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.fetchData();
      });
    }
  }

  submitData(): void {
    if (this.itemForm.invalid) return;
    if (this.editMode && this.itemId) {
      this.editItem();
    } else {
      this.createItem();
    }
  }

  onPageChange($event: any): void {
    this.currentPage = $event;
    this.resetItemForm();
    this.fetchData();
  }

  onCreateButtonClick(): void {
    console.log("on create button clicked..")
  }

  private editItem(): void {
    this.itemService.updateItem(this.itemId, this.itemForm.getRawValue()).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchData();
      this.resetItemForm();
      this.editMode = false;
      this.itemId = '';
    });
  }

  private createItem(): void {
    const newItem: Item = this.itemForm.value;
    this.itemService.createItem(newItem).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.resetItemForm();
      this.fetchData();
    });
  }

  private fetchData(): void {
    const payload = { page: this.currentPage, limit: this.itemsPerPage };
    this.itemService.getAllItems(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.items.set(data.items);
      this.totalCount.set(data.totalCount);
    });
  }

  private formInitializer(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      description: [''],
    });
  }

  private resetItemForm(): void{
    this.itemForm.reset();
  }
}
