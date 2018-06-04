import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css']
})
export class HeroDetailsComponent implements OnInit {

  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private service: HeroService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
  }

  goBack(): void {
    this.location.back();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.service.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  save(): void {
    this.service.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  deleteHero(hero): void {
    this.service.deleteHero(hero).subscribe(() => this.goBack());
  }

}
