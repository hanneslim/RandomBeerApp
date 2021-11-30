import { RandomBeerFacadeService } from './random-beer-facade.service';

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

type TestBeer = {
  brand: string;
  name: string;
  style: string;
  hop: string;
  alcohol: string;
};

type TestBeerState = {
  beerArray: TestBeer[];
  size: number;
};

const initStateMock: TestBeerState = {
  beerArray: [
    {
      brand: 'Pabst Blue Ribbon',
      name: 'Two Hearted Ale',
      style: 'Merican Ale',
      hop: 'Sorachi Ace',
      alcohol: '2,9%',
    },
  ],
  size: 1,
};

describe('Random Beer Facade Service', () => {
  let testFacade: RandomBeerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomBeerFacadeService],
      imports: [HttpClientTestingModule],
    });
    testFacade = TestBed.inject(RandomBeerFacadeService);
    testFacade['updateState'](initStateMock);
  });

  it('should create the service', () => {
    expect(testFacade).toBeTruthy();
  });

  it('should initialize state values', (done) => {
    testFacade.vm$.subscribe((vm) => {
      expect(vm).toEqual(initStateMock);
      done();
    });
  });

  it('should get individual Observable "stream" of vm data', (done) => {
    testFacade.vm$.subscribe((vm) => {
      expect(vm.size).toEqual(initStateMock.size);
      done();
    });
  });

  it('should update state values', (done) => {
    const updatedStateMock: TestBeerState = {
      beerArray: [
        {
          brand: 'Pabst Blue Ribbon',
          name: 'Two Hearted Ale',
          style: 'Merican Ale',
          hop: 'Sorachi Ace',
          alcohol: '2,9%',
        },
        {
          brand: 'Bud Light',
          name: 'La fin Du Monde',
          style: 'Stout',
          hop: 'Bullion',
          alcohol: '2,7%',
        },
      ],
      size: 2,
    };
    testFacade['updateState'](updatedStateMock);
    testFacade.vm$.subscribe((vm) => {
      expect(vm).toEqual(updatedStateMock);
      done();
    });
  });

  it('should update the size value', (done) => {
    const newSize = 9;
    const mockEvent = {
      target: {
        value: newSize,
      },
    };
    testFacade['updateSize'](mockEvent);
    testFacade.vm$.subscribe((vm) => {
      expect(vm.size).toEqual(newSize);
      done();
    });
  });

  it('should perform a mocked http request', (done) => {
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    const mockResponse = {
      brand: 'Pabst Blue Ribbon',
      name: 'Two Hearted Ale',
      style: 'Merican Ale',
      hop: 'Sorachi Ace',
      alcohol: '2,9%',
    };

    testFacade['findBeerArray'](1);
    testFacade.vm$.subscribe((tb) => {
      expect(tb.beerArray).toBeTruthy();
      expect(tb.beerArray[0].brand).toBe(mockResponse.brand);
      expect(tb.beerArray[0].name).toBe(mockResponse.name);
      expect(tb.beerArray[0].style).toBe(mockResponse.style);
      expect(tb.beerArray[0].hop).toBe(mockResponse.hop);
      expect(tb.beerArray[0].alcohol).toBe(mockResponse.alcohol);

      done();
    });

    const mockRequest = httpMock.expectOne(
      'https://random-data-api.com/api/beer/random_beer?size=1'
    );
    mockRequest.flush(mockResponse);
  });
});
