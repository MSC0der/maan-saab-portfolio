import { Component } from '@angular/core';

import { ARTICLES } from '../../data/articles.data';

import { BlogCardWayneComponent } from '../blog-card-wayne/blog-card-wayne.component';

@Component({
  selector: 'app-blog-grid-wayne',
  standalone: true,
  imports: [BlogCardWayneComponent],
  templateUrl: './blog-grid-wayne.component.html',
  styleUrl: './blog-grid-wayne.component.scss',
})
export class BlogGridWayneComponent {
  protected readonly articles = ARTICLES;
}
