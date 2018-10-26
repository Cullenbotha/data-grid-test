import { TestBed } from '@angular/core/testing';

import { TodosService, Todo } from './todos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TodosService', () => {
  let todosService: TodosService
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    todosService = TestBed.get(TodosService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: TodosService = TestBed.get(TodosService);
    expect(service).toBeTruthy();
  });

  describe('#getTodos', () => {
    it('should return a Observable<Todo[]>', () => {
      const testData: Todo[] = [
        { userId: 1, id: 1, title: "Lorem ipsum dolor sit", completed: true },
        { userId: 2, id: 2, title: "Sed ac dui blandit", completed: false },
        { userId: 3, id: 3, title: "Ut lobortis erat a", completed: false },
      ];

      todosService.getTodos()
        .subscribe((data: Todo[]) => {
          expect(data.length).toBe(3);
          expect(data).toEqual(testData);
        });

      const req = httpTestingController.expectOne(todosService.todosDataUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });

    it('should catch errors and return a user friendly error', () => {
      todosService.getTodos()
        .subscribe((data: Todo[]) => {
          // Won't reach this
        }, (error) => {
          expect(error).toEqual('Something went wrong, please try again later.');
        });

      const req = httpTestingController.expectOne(todosService.todosDataUrl);
      req.error(new ErrorEvent('network error'));
    });
  });
});
