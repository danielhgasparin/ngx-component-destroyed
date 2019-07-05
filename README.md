# Unsubscribe from Observables in Angular

This code provides utility methods which help to unsubscribe from ReactiveX's Observables in Angular applications.

**Why?**

Failing to unsubscribe from observables will lead to unwanted memory leaks as the observable stream is left open, potentially even after a component has been destroyed or the user has navigated to another page.

*Important*: If services are used in [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection#hierarchical-dependency-injectors) they are affected by the same memory-leak issue!

This blog post provides additional information:

https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3

- Requires >= RxJS 6.0.0 (part of Angular 6)

**Prepare the class**

The class must have a `ngOnDestroy()` method (it can be empty):

```
@Component({
  selector: 'foo',
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnDestroy {

  // ...

  ngOnDestroy() {
  }
  
}
```

## Usage

Either use

- `takeUntilComponentDestroyed(this)`
- `takeUntil(componentDestroyed(this))`
 
as the last Observable pipe operator. The TypeScript compiler will ensure that `this`' class implements a `ngOnDestroy()` method.

```
@Component({
  selector: 'foo',
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnInit, OnDestroy {

  ngOnInit() {
    interval(1000)
        .pipe(
            takeUntilComponentDestroyed(this) // <--- magic is here!
        )
        .subscribe();
  }

  ngOnDestroy() {
  }
  
}
```
