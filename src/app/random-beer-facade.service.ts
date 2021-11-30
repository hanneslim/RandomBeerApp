import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Beer {
  brand: string;
  name: string;
  style: string;
  hop: string;
  alcohol: string;
}

export interface BeerState {
  beerArray: Beer[];
  size: number;
}

let _state: BeerState = {
  beerArray: [],
  size: 4,
};

@Injectable({
  providedIn: 'root',
})
export class RandomBeerFacadeService {
  private store = new BehaviorSubject<BeerState>(_state);
  private state$ = this.store.asObservable();

  beerArray$ = this.state$.pipe(
    map((state) => state.beerArray),
    distinctUntilChanged()
  );

  size$ = this.state$.pipe(
    map((state) => state.size),
    distinctUntilChanged()
  );

  vm$: Observable<BeerState> = combineLatest(this.beerArray$, this.size$).pipe(
    map(([beerArray, size]) => {
      return { beerArray, size };
    })
  );

  constructor(private http: HttpClient) {
    combineLatest(this.size$)
      .pipe(
        //switchMap: Maps values to observable. Cancels the previous inner observable.
        switchMap(([size]) => {
          return this.findBeerArray(size);
        })
      )
      .subscribe((beerArray) => {
        this.updateState({ ..._state, beerArray });
      });
  }

  updateSize(selectedSize: any) {
    const size = selectedSize.target.value;
    this.updateState({ ..._state, size });
  }

  private updateState(state: BeerState) {
    this.store.next((_state = state));
  }

  /** RandomBeer REST call */
  private findBeerArray(size: number): Observable<Beer[]> {
    const url = `https://random-data-api.com/api/beer/random_beer?size=${size}`;
    return this.http.get<Beer[]>(url);
  }
}
