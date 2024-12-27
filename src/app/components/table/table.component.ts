import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { Item } from '../../models';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgxPaginationModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() items!: Signal<any>;
  @Input() totalCount!: Signal<number>;
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;

  @Output() editItem = new EventEmitter<Item>();
  @Output() deleteItem = new EventEmitter<Item>();
  @Output() pageNumber = new EventEmitter<void>();

  pageChanged($event: any): void {
    this.pageNumber.emit($event)
  }
}
