import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../models';
import { Subject, takeUntil } from 'rxjs';
import { ItemService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  itemForm!: FormGroup;
  editMode: boolean = false;
  items = signal<Item[]>([]);
  totalCount = signal<number>(0);
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemId!: number;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
  ) { this.formInitializer(); }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}
