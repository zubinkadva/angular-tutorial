import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private url = 'api/heroes';  // URL to web api

  constructor(private service: MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    // this.service.addMessage('Heroes fetched');
    // return of(HEROES);
    return this.http.get<Hero[]>(this.url).pipe(
      tap(heroes => this.log('Heroes fetched')),
      catchError(this.handleError('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    // this.service.addMessage(`Hero fetched with id  ${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    const url = `${this.url}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`Hero fetched with id  ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private log(message: string) {
    this.service.addMessage(message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.url, hero, httpOptions).pipe(
      tap(_ => this.log(`Updated hero with id ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.url, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`Added hero wuth id ${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.url}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`Deleted hero with id ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`Found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.url}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `Fetched` : `did not find`;
          this.log(`${outcome} hero id ${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

}
