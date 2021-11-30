import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BeerState,
  RandomBeerFacadeService,
} from './random-beer-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  vm$: Observable<BeerState> = this.facadeService.vm$;

  //facadeService is public for direct usage in html
  constructor(public facadeService: RandomBeerFacadeService) {}
  title = 'RandomBeerApp';
}
