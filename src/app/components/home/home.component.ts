import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../table/table.component';
import { ButtonComponent } from "../button/button.component";
import { Dialog } from '@angular/cdk/dialog';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  items = signal<Item[]>([]);
  totalCount = signal<number>(0);
  currentPage: number = 1;
  itemsPerPage: number = 5;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onPageChange($event: any): void {
    this.currentPage = $event;
    this.fetchData();
  }

  onCreateButtonClick(): void {
    this.dialog.open(FormComponent, {
      width: '500px',
      data: {
        title: 'Create Item',
      }
    }).closed.subscribe((data: any) => {
      if (data) {
        this.createItem(data);
      }
    })
  }

  onEditItem(item: Item): void {
    const itemId = item.id;
    this.dialog.open(FormComponent, {
      width: '500px',
      data: {
        title: 'Edit Item',
        item: item
      }
    }).closed.subscribe((data: any) => {
      if (data) {
        this.editItem(itemId, data);
      }
    })
  }

  private editItem(itemId: any, item: Item): void {
    this.itemService.updateItem(itemId, item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchData();
    });
  }

  private createItem(item: Item): void {
    this.itemService.createItem(item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
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
}
