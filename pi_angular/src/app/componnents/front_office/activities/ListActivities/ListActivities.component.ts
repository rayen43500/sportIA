import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activities/activity.model';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { ActivityService } from 'src/app/services/activities/Activity.service';
import { NgForm } from '@angular/forms';
import { ActivityTypeService } from 'src/app/services/activities/ActivityType.service';
import { AiChatComponent } from './ai-chat/ai-chat.component';

declare var bootstrap: any;

@Component({
  selector: 'app-list-activities',
  templateUrl: './ListActivities.component.html',
  styleUrls: ['./ListActivities.component.scss']
})
export class ListActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  activityTypes: ActivityType[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 6; // Nombre d'éléments par page
  newActivity: Activity = {
    actId: 0,
    title: '',
    ActivityDate: new Date(),
    reputation: 0,
    duration: 0,
    activityType: {} as ActivityType
  };
  selectedActivityType: number = 0;
  private modal: any;
  isLoading: boolean = false;

  constructor(
    private activityService: ActivityService,
    private activityTypeService: ActivityTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadActivities();
    this.loadActivityTypes();
    // Initialiser la modale Bootstrap
    setTimeout(() => {
      const modalElement = document.getElementById('addActivityModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }
    }, 0);
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.filteredActivities = data;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités', err);
        this.isLoading = false;
      }
    });
  }

  loadActivityTypes(): void {
    this.activityService.getAllActivityTypes().subscribe({
      next: (data) => {
        this.activityTypes = data;
      },
      error: (err) => console.error('Erreur lors du chargement des types d\'activités', err)
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredActivities.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get paginatedActivities(): Activity[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredActivities.slice(start, end);
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredActivities = [...this.activities];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredActivities = this.activities.filter(activity => 
        activity.title.toLowerCase().includes(searchTermLower) ||
        (activity.activityType && activity.activityType.title && 
         activity.activityType.title.toLowerCase().includes(searchTermLower))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  onAddActivity(): void {
    // Réinitialiser le formulaire
    this.newActivity = {
      actId: 0,
      title: '',
      ActivityDate: new Date(),
      reputation: 0,
      duration: 0,
      activityType: {} as ActivityType
    };
    this.selectedActivityType = 0;
    
    // Utiliser une approche plus robuste pour ouvrir la modale
    setTimeout(() => {
      const modalElement = document.getElementById('addActivityModal');
      if (modalElement) {
        if (!this.modal) {
          this.modal = new bootstrap.Modal(modalElement);
        }
        this.modal.show();
      } else {
        console.error('Élément modal non trouvé');
      }
    }, 0);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const selectedType = this.activityTypes.find(type => type.actTypeId === this.selectedActivityType);
      if (!selectedType) {
        console.error('Type d\'activité non trouvé');
        return;
      }

      const activityToCreate: Activity = {
        ...this.newActivity,
        activityType: selectedType
      };

      this.activityService.createActivity(activityToCreate, this.selectedActivityType).subscribe({
        next: (response) => {
          console.log('Activité créée avec succès', response);
          this.modal.hide();
          this.loadActivities();
          // Réinitialiser le formulaire
          this.newActivity = {
            actId: 0,
            title: '',
            ActivityDate: new Date(),
            reputation: 0,
            duration: 0,
            activityType: {} as ActivityType
          };
          this.selectedActivityType = 0;
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'activité', err);
        }
      });
    }
  }

  onEditActivity(id: number): void {
    // Rediriger vers la page d'édition avec l'ID de l'activité
    this.router.navigate([`/activities/edit/${id}`]);
  }

  onDeleteActivity(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: (response) => {
          console.log('Activité supprimée', response);
          this.loadActivities(); // Recharger les activités au lieu de rediriger
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'activité', err);
        }
      });
    }
  }

  // Méthodes pour les nouveaux boutons
  onViewDetails(id: number): void {
    this.router.navigate([`/activities/details/${id}`]);
  }

  onChangeStatus(id: number): void {
    // Logique pour changer le statut d'une activité
    // Cette méthode devrait être implémentée selon les besoins spécifiques
    console.log('Changer le statut de l\'activité', id);
  }

  onViewStatistics(): void {
    // Logique pour afficher les statistiques
    // Cette méthode devrait être implémentée selon les besoins spécifiques
    console.log('Afficher les statistiques');
  }

  onListAllActivities(): void {
    // Réinitialiser les filtres et afficher toutes les activités
    this.searchTerm = '';
    this.filteredActivities = [...this.activities];
    this.currentPage = 1;
    this.updatePagination();
  }

  openAIChat(): void {
    const modalElement = document.getElementById('aiChatModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
