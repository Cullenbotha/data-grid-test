import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosTableComponent } from './todos-table.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodosService, Todo } from "../todos.service";

const testData: Todo[] = [
  { userId: 1, id: 1, title: 'Lorem ipsum dolor sit', completed: true },
  { userId: 2, id: 2, title: 'Sed ac dui blandit', completed: false },
  { userId: 3, id: 3, title: 'Ut lobortis erat a', completed: false },
];

describe('TodosTableComponent', () => {
  let component: TodosTableComponent;
  let fixture: ComponentFixture<TodosTableComponent>;
  let todosService: TodosService;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosTableComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();

    todosService = TestBed.get(TodosService);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a table with "User ID", "ID", "Title" and "Completed" headers', () => {
    let el = fixture.debugElement.nativeElement;
    expect(el.querySelector('table')).toBeTruthy();
    expect(el.querySelector('table').tHead.innerText).toContain('User ID');
    expect(el.querySelector('table').tHead.innerText).toContain('ID');
    expect(el.querySelector('table').tHead.innerText).toContain('Title');
    expect(el.querySelector('table').tHead.innerText).toContain('Completed');
  });

  it('should show "Loading..." if data is not loaded yet', () => {
    let el = fixture.debugElement.nativeElement;
    expect(el.querySelector('table tbody tr td').innerText)
      .toEqual('Loading...');
  });


  it('should execute getTodos to fetch todos data on init', () => {
    spyOn(component, 'getTodos');
    component.ngOnInit();
    expect(component.getTodos).toHaveBeenCalled();
  });

  it('should remove "Loading..." if data is loaded', () => {
    let el = fixture.debugElement.nativeElement;

    // mock the data returned from TodosService and detect changes
    const req = httpTestingController.expectOne(todosService.todosDataUrl);
    req.flush(testData);
    fixture.detectChanges();
    expect(el.innerText).not.toContain('Loading...')
  });

  describe('#filterTodos', () => {
    it("should filter out any todos that don't have completed as true", () => {
      // supply the component with test data to sort
      component.todosData = testData;

      // change selected filter and call invoke filterTodos
      component.selectedFilter = "true";
      component.filterTodos();

      expect(component.todos.map(x => x.completed)).not.toContain(false);
      expect(component.todos.length).toEqual(1);
    });

    it("should filter out any todos that don't have completed as false", () => {
      component.todosData = testData;
      component.selectedFilter = "false";

      component.filterTodos();
      fixture.detectChanges();

      expect(component.todos.map(x => x.completed)).not.toContain(true);
      expect(component.todos.length).toEqual(2);
    });

    it("shouldn't filter out any todos", () => {
      component.todosData = testData;
      component.selectedFilter = "all";

      component.filterTodos();
      fixture.detectChanges();

      expect(component.todos.map(x => x.completed)).toContain(true);
      expect(component.todos.map(x => x.completed)).toContain(false);
      expect(component.todos.length).toEqual(3);
    });

    it("should sort todo's by id (ascending)", () => {
      // pass array reversed so order is desc
      component.todosData = testData.reverse();
      expect(component.todosData[0].id).toEqual(3);

      // confirm todos hasn't been defined
      expect(component.todos).toBeFalsy();

      // call filter and check if todos was defined and sorted
      component.filterTodos();
      expect(component.todos[0].id).toEqual(1);
    });
  });

  describe('#onFilter', () => {
    it('should change selected filter to passed argument and invoke filterTodos', () => {
      // filterTodos function required todosData to have been set
      component.todosData = testData;

      // Add spy so we can see if filter todos gets called
      spyOn(component, 'filterTodos');

      // by default selected filter should equal all
      expect(component.selectedFilter).toEqual('all');

      // invoke onFilter and pass new filter value
      component.onFilter('true');

      // expect selected filter to be updated to the new filter value
      expect(component.selectedFilter).toEqual('true');

      // expect filterTodos to have been called from within onFilter
      expect(component.filterTodos).toHaveBeenCalled();
    });
  });
});
