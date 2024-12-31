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
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    SearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  items = signal<Item[]>([]);
  totalCount = signal<number>(0);
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';

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

  confirmAndDeleteItem(item: Item): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: 'Are you sure you want to delete this item?'
      }
    }).closed.subscribe((yes) => {
      if (yes) { this.removeItemAndRefresh(item) }
    })
  }

  openCreateItemDialog(): void {
    this.dialog.open(FormComponent, {
      data: {
        title: 'Create Item',
      }
    }).closed.subscribe((data: any) => {
      if (data) { this.addItemAndRefresh(data); }
    })
  }

  openEditItemDialog(item: Item): void {
    const itemId = item.id;
    this.dialog.open(FormComponent, {
      data: {
        title: 'Edit Item',
        item: item
      }
    }).closed.subscribe((data: any) => {
      if (data) { this.updateItemAndRefresh(itemId, data); }
    })
  }

  handlePageChange($event: any): void {
    this.currentPage = $event;
    if (this.searchTerm) {
      this.searchItem();
    } else {
      this.fetchData();
    }
  }

  handleSearchTermChange($event: any): void {
    if ($event) {
      this.searchTerm = $event;
      this.searchItem();
    } else {
      this.searchTerm = '';
      this.fetchData();
    }
  }

  private removeItemAndRefresh(item: Item): void {
    this.itemService.deleteItem(item.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshItemsAfterAction('Item deleted successfully !');
    });
  }

  private updateItemAndRefresh(itemId: any, item: Item): void {
    this.itemService.updateItem(itemId, item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshItemsAfterAction('Item updated successfully !');
    });
  }

  private addItemAndRefresh(item: Item): void {
    this.itemService.createItem(item).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshItemsAfterAction('Item created successfully !');
    });
  }

  private refreshItemsAfterAction(message: string): void {
    this.fetchData();
    this.notificationService.showNotification(message, false);
  }

  private fetchData(): void {
    const payload = this.getPaginationPayload();
    this.itemService.getAllItems(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.items.set(data.items);
      this.totalCount.set(data.totalCount);
    });
  }

  private searchItem(): void {
    const payload = this.getPaginationPayload();
    this.itemService.searchItem(this.searchTerm, payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.items.set(data.items);
      this.totalCount.set(data.totalCount);
    })
  }

  private getPaginationPayload(): { page: number; limit: number } {
    return { page: this.currentPage, limit: this.itemsPerPage };
  }
}
