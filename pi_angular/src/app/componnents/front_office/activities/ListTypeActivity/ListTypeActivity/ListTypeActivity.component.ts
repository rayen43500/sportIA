import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { ActivityService } from 'src/app/services/activities/Activity.service';

@Component({
  selector: 'app-ListTypeActivity',
  templateUrl: './ListTypeActivity.component.html',
  styleUrls: ['./ListTypeActivity.component.css']
})
export class ListTypeActivityComponent  implements OnInit {

  activityTypes: ActivityType[] = [];
  filteredTypes: ActivityType[] = [];
  paginatedTypes: ActivityType[] = [];

  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  isExpanded: { [key: string]: boolean } = {};

  toggleExpand(title: string): void {
    this.isExpanded[title] = !this.isExpanded[title];
  }
  
  constructor(private activityTypeService: ActivityService,     private router: Router
  ) {}

  ngOnInit(): void {
    this.activityTypeService.getAllActivityTypes().subscribe({
      next: (data) => {
        this.activityTypes = data;
        this.filteredTypes = data;
        this.updatePagination();
      },
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTypes = this.activityTypes.filter(type =>
      type.title.toLowerCase().includes(term)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTypes.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTypes = this.filteredTypes.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

}