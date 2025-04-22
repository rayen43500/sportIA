import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activities/activity.model';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { ActivityService } from 'src/app/services/activities/Activity.service';
import { NgForm } from '@angular/forms';
import { ActivityTypeService } from 'src/app/services/activities/ActivityType.service';

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
  
  // Filter properties
  filterActivityType: number | null = null;
  filterDateStart: string | null = null;
  filterDateEnd: string | null = null;
  filterReputation: number = 0;
  filterDuration: number | null = null;

  newActivity: Activity = {
    actId: 0,
    title: '',
    activityDate: new Date(),
    reputation: 0,
    duration: 0,
    activityType: {} as ActivityType
  };
  selectedActivityType: number | null = null;
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
    this.activityTypeService.getAllActivityTypes().subscribe({
      next: (data) => {
        this.activityTypes = data;
        console.log('Activity types loaded:', this.activityTypes);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'activités', err);
        // Use the ActivityService as fallback if ActivityTypeService fails
        this.activityService.getAllActivityTypes().subscribe({
          next: (data) => {
            this.activityTypes = data;
            console.log('Activity types loaded from ActivityService:', this.activityTypes);
          },
          error: (fallbackErr) => console.error('Erreur lors du chargement des types d\'activités (fallback)', fallbackErr)
        });
      }
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
    if (!this.searchTerm.trim() && 
        this.filterActivityType === null && 
        this.filterDateStart === null && 
        this.filterDateEnd === null && 
        this.filterReputation === 0 && 
        this.filterDuration === null) {
      this.filteredActivities = [...this.activities];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      
      this.filteredActivities = this.activities.filter(activity => {
        // Text search filter
        const textMatch = !searchTermLower || 
          activity.title.toLowerCase().includes(searchTermLower) || 
          (activity.activityType && activity.activityType.title && 
           activity.activityType.title.toLowerCase().includes(searchTermLower));
        
        // Activity type filter
        const typeMatch = this.filterActivityType === null || 
          (activity.activityType && activity.activityType.actTypeId === this.filterActivityType);
        
        // Date range filter
        let dateMatch = true;
        const activityDate = new Date(activity.activityDate);
        
        if (this.filterDateStart && this.filterDateStart.trim() !== '') {
          const startDate = new Date(this.filterDateStart);
          // Clear time part to compare only dates
          startDate.setHours(0, 0, 0, 0);
          dateMatch = dateMatch && activityDate >= startDate;
        }
        
        if (this.filterDateEnd && this.filterDateEnd.trim() !== '') {
          const endDate = new Date(this.filterDateEnd);
          // Set time to end of day to include the end date
          endDate.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && activityDate <= endDate;
        }
        
        // Reputation filter
        const reputationMatch = activity.reputation >= this.filterReputation;
        
        // Duration filter
        const durationMatch = this.filterDuration === null || activity.duration <= this.filterDuration;
        
        // All filters must pass
        return textMatch && typeMatch && dateMatch && reputationMatch && durationMatch;
      });
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterActivityType = null;
    this.filterDateStart = null;
    this.filterDateEnd = null;
    this.filterReputation = 0;
    this.filterDuration = null;
    this.filteredActivities = [...this.activities];
    this.currentPage = 1;
    this.updatePagination();
  }

  onAddActivity(): void {
    // Réinitialiser le formulaire
    this.newActivity = {
      actId: 0,
      title: '',
      activityDate: new Date(),
      reputation: 0,
      duration: 0,
      activityType: {} as ActivityType
    };
    this.selectedActivityType = null;
    
    // Ensure activity types are loaded
    if (this.activityTypes.length === 0) {
      this.loadActivityTypes();
    }
    
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
      // Convert selectedActivityType to number to ensure type consistency
      const activityTypeId = Number(this.selectedActivityType);
      const selectedType = this.activityTypes.find(type => type.actTypeId === activityTypeId);
      
      if (!selectedType) {
        console.error('Type d\'activité non trouvé', activityTypeId);
        console.log('Available types:', this.activityTypes);
        return;
      }

      // Convert date string to desired format (if date is a string from the form)
      let formattedDate: string;
      
      if (typeof this.newActivity.activityDate === 'string') {
        formattedDate = this.newActivity.activityDate;
      } else {
        formattedDate = this.formatDateToISO(this.newActivity.activityDate);
      }

      // Create the activity object with both necessary properties
      const activityToCreate: Activity = {
        ...this.newActivity,
        activityDate: new Date(formattedDate),
        activityType: selectedType
      };

      // Add additional property for backend compatibility
      const requestPayload = {
        ...activityToCreate,
        activityDate: formattedDate // Add camelCase version for backend
      };

      console.log('Sending activity to server:', requestPayload);

      this.activityService.createActivity(requestPayload as any, activityTypeId).subscribe({
        next: (response) => {
          console.log('Activité créée avec succès', response);
          this.modal.hide();
          this.loadActivities();
          // Réinitialiser le formulaire
          this.newActivity = {
            actId: 0,
            title: '',
            activityDate: new Date(),
            reputation: 0,
            duration: 0,
            activityType: {} as ActivityType
          };
          this.selectedActivityType = null;
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'activité', err);
        }
      });
    }
  }

  // Helper function to format a date to ISO format (yyyy-MM-dd)
  private formatDateToISO(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onEditActivity(id: number): void {
    // Rediriger vers la page d'édition avec l'ID de l'activité
    this.router.navigate([`/add-edit/${id}`]);
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
    // Navigate to the statistics page
    this.router.navigate(['/statistics']);
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
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
      console.log('Chat IA ouvert avec intégration Gemini API');
    } else {
      console.error('Élément modal non trouvé: aiChatModal');
    }
  }

  onViewActivityDetails(id: number): void {
    // Navigate to activity details page
    this.router.navigate(['/activities/details', id]);
  }
}
