import { Component, OnInit } from '@angular/core';
import { TodosService, Todo } from "../todos.service";

@Component({
  selector: 'app-todos-table',
  templateUrl: './todos-table.component.html',
  styleUrls: ['./todos-table.component.css']
})
export class TodosTableComponent implements OnInit {
  filterOptions = ['all', 'true', 'false'];
  selectedFilter = 'all';
  todosData: Todo[];
  todos: Todo[];
  error: string;

  constructor(private todosService: TodosService) { }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    // fetch todos data, assign to variables and invoke filterTodos
    this.todosService.getTodos()
      .subscribe((data: Todo[]) => {
        this.todosData = data;
        this.filterTodos();
      }, (error: string) => {
        this.error = error;
      });
  }

  onFilter(filter) {
    // set filter variable for dynamic class assignment, invoke filterTodos
    this.selectedFilter = filter;
    this.filterTodos();
  }

  filterTodos() {
    // reset todos back to initial todos data
    this.todos = this.todosData;

    // filter out todos that don't match the selectedFilter, unless 'all'
    if (this.selectedFilter !== 'all') {
      // JSON parse selectedFilter string to convert it to boolean
      this.todos = this.todos
        .filter(todo => todo.completed === JSON.parse(this.selectedFilter));
    }

    // sort todos by id (ascending) in component as apposed to making a custom pipe,
    // as per: https://angular.io/guide/pipes#appendix-no-filterpipe-or-orderbypipe
    this.todos.sort(function (a, b) {
     return a.id - b.id;
    });
  }
}
