import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/models/activities/activity.model';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { ActivityService } from 'src/app/services/activities/Activity.service';

@Component({
  selector: 'app-AddEditActivities',
  templateUrl: './AddEditActivities.component.html',
  styleUrls: ['./AddEditActivities.component.css']
})
export class AddEditActivitiesComponent  {

  activity: Activity = { actId: 0, title: '', ActivityDate: new Date(), reputation: 0, duration: 0,  activityType: {
    actTypeId: 0,
    title: '',             // Correspond à la propriété 'Title' en majuscule
    description: '',
    Type: '',
    BodyPart: '',
    Equipment: '',
    Level: '',
    Rating: 0,
    RatingDesc: '',
    activity: {} as Activity  // Initialisation avec un objet vide de type Activity

  }};
  activityTypeId: number = 0; // ID du type d'activité à associer
  isEditMode: boolean = false; // Détecte si on est en mode modification
  activityId: number = 0; // L'ID de l'activité à modifier (si présent)
  activityTypes: ActivityType[] = [];  // Liste des types d'activités

  constructor(
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les types d'activités
    this.loadActivityTypes();

    // Vérifier si un ID d'activité est passé dans l'URL
    this.activatedRoute.params.subscribe(params => {
      this.activityId = params['id']; // Récupère l'ID de l'activité depuis les paramètres de l'URL

      if (this.activityId) {
        this.isEditMode = true;
        this.loadActivity(); // Charger l'activité à modifier
      } else {
        this.isEditMode = false; // Ajouter une nouvelle activité
      }
    });
  }

  loadActivityTypes(): void {
    this.activityService.getAllActivityTypes().subscribe({
      next: (data) => {
        this.activityTypes = data;
  
        // Si on est en mode édition, on assigne l'ID du type d'activité de l'activité à modifier
        if (this.isEditMode) {
          this.activityTypeId = this.activity.activityType.actTypeId;
        } else {
          // Si c'est un ajout, vous pouvez choisir un type par défaut, par exemple le premier type de la liste
          if (this.activityTypes && this.activityTypes.length > 0) {
            this.activityTypeId = this.activityTypes[0].actTypeId;
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'activités', err);
      }
    });
  }
  

// Dans votre composant AddEditActivities.component.ts

formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

  // Charger l'activité à modifier
  loadActivity(): void {
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (data) => {
        this.activity = data;
      
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'activité', err);
      }
    });
  }

  // Soumettre le formulaire pour ajouter ou modifier une activité
  onSubmit(): void {
    if (this.isEditMode) {
      this.updateActivity(); // Modifier l'activité existante
    } else {
      this.createActivity(); // Créer une nouvelle activité
    }
  }

  // Créer une nouvelle activité
  createActivity(): void {
    console.log('Données à envoyer pour créer l\'activité :', this.activity, this.activityTypeId); // Ajout du log
    this.activityService.createActivity(this.activity, this.activityTypeId).subscribe({
      next: (data) => {
        console.log('Activité créée', data);
        this.router.navigate(['/ListActivity']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'activité', err);
      }
    });
  }
  

  // Modifier une activité existante
  updateActivity(): void {
    this.activityService.updateActivity(this.activityId, this.activity).subscribe({
      next: (data) => {
        console.log('Activité mise à jour', data);
        this.router.navigate(['/ListActivity']); // Rediriger vers la liste des activités
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de l\'activité', err);
      }
    });
  }
}