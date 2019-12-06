import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

export function componentDestroyed(component: OnDestroy): Observable<true> {
    const modifiedComponent = component as { __componentDestroyed$?: Observable<true>, ngOnDestroy(): void };
    if (modifiedComponent.__componentDestroyed$) {
        return modifiedComponent.__componentDestroyed$;
    }
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new ReplaySubject<true>();
    modifiedComponent.ngOnDestroy = () => {
        if (oldNgOnDestroy) {
            oldNgOnDestroy.apply(component);
        }
        stop$.next(true);
        stop$.complete();
    };
    return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
}

export function takeUntilComponentDestroyed<T>(component: OnDestroy): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
