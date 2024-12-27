import { Component } from '@angular/core';
import { LoaderService } from '../../services';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading: boolean = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.loader$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
