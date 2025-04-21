import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { Activity } from 'src/app/models/activities/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private baseUrl = 'http://localhost:8085/api/Activity'; 

constructor(private http: HttpClient) { }

getAllActivityTypes(): Observable<ActivityType[]> {
  return this.http.get<ActivityType[]>(`${this.baseUrl}/allType`);
}
// Créer une activité
createActivity(activity: Activity, activityTypeId: number): Observable<Activity> {
  return this.http.post<Activity>(`${this.baseUrl}/create/${activityTypeId}`, activity);
}

getAllActivities(): Observable<Activity[]> {
  return this.http.get<Activity[]>(`${this.baseUrl}/getAll`, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'json' // Spécifie que la réponse doit être en JSON
  });
}
// Obtenir une activité par son ID
getActivityById(id: number): Observable<Activity> {
  return this.http.get<Activity>(`${this.baseUrl}/get/${id}`);
}

// Mettre à jour une activité
updateActivity(id: number, activityDetails: Activity): Observable<Activity> {
  return this.http.put<Activity>(`${this.baseUrl}/update/${id}`, activityDetails);
}

// Supprimer une activité
deleteActivity(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
}

}
