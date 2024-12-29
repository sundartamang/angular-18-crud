import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../table/table.component';
import { ButtonComponent } from "../button/button.component";
import { Dialog } from '@angular/cdk/dialog';
import { FormComponent } from '../form/form.component';
import { NotificationService } from '../../services';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
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
  itemsPerPage: number = 10;

  private destroy$ = new Subject<void>();

  constructor(
    private itemService: ItemService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDeleteItem(item: Item): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: 'Are you sure you want to delete this item?'
      }
    }).closed.subscribe((yes) => {
      if (yes) { this.deleteItem(item) }
    })
  }

  onCreateButtonClick(): void {
    this.dialog.open(FormComponent, {
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

  onPageChange($event: any): void {
    this.currentPage = $event;
    this.fetchData();
  }

  private deleteItem(item: Item): void {
    this.itemService.deleteItem(item.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchData();
      this.notificationService.showNotification('Item deleted successfully !', false);
    });
  }

  private editItem(itemId: any, item: Item): void {
    this.itemService.updateItem(itemId, item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchData();
      this.notificationService.showNotification('Item updated successfully !', false);
    });
  }

  private createItem(item: Item): void {
    this.itemService.createItem(item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.notificationService.showNotification('Item created successfully !', false);
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
