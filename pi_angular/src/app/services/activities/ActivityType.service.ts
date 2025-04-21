import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeService {
  private apiUrl = `${environment.apiUrl}/activity-types`;

  constructor(private http: HttpClient) { }

  getAllActivityTypes(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(this.apiUrl);
  }

  getActivityTypeById(id: number): Observable<ActivityType> {
    return this.http.get<ActivityType>(`${this.apiUrl}/${id}`);
  }

  createActivityType(activityType: ActivityType): Observable<ActivityType> {
    return this.http.post<ActivityType>(this.apiUrl, activityType);
  }

  updateActivityType(id: number, activityType: ActivityType): Observable<ActivityType> {
    return this.http.put<ActivityType>(`${this.apiUrl}/${id}`, activityType);
  }

  deleteActivityType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 