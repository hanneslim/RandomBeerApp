import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  BeerState,
  RandomBeerFacadeService,
} from './random-beer-facade.service';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [RandomBeerFacadeService],
    });
    component = TestBed.createComponent(AppComponent).componentInstance;
    component.vm$ = new Observable<BeerState>();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  //the following tests fail...timeout
  it('should contain a random beer list', fakeAsync(() => {
    component.vm$.subscribe(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const randBeerList =
          fixture.nativeElement.querySelector('#random-beer-list');
        expect(randBeerList).toBeTruthy();
      });
    });
  }));

  it('should contain an input field', fakeAsync(() => {
    component.vm$.subscribe(() => {
      fixture.detectChanges();
      const inputField = fixture
        .whenStable()
        .then(fixture.nativeElement.querySelector('#input-rand-beer'));
      expect(inputField).toBeTruthy();
    });
  }));
});
