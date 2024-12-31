import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinct, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  
  searchText: string = '';
  private searchSubject = new Subject<string>();

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(1000),
    ).subscribe((text) => {
      this.searchTextChanged.emit(text);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchTextChange(): void {
    this.searchSubject.next(this.searchText);
  }

  get haveSearchValue(): boolean {
    return !!this.searchText;
  }

  clearSearch(): void {
    this.searchText = '';
    this.searchSubject.next(this.searchText);
  }
}
