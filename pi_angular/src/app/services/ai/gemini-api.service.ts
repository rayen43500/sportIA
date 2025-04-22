import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  generateContent(prompt: string): Observable<string> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    
    const contextualizedPrompt = `
      [Instructions: Tu es un assistant spécialisé dans les activités sportives, le fitness et la santé. 
      Tu dois toujours répondre dans le contexte de la gestion des activités sportives, du bien-être et du mode de vie sain.
      Tes réponses doivent être informatives, encourageantes et adaptées à tous les niveaux d'activité physique.
      Reste concis et va droit au but dans tes explications.
      Si la question n'est pas liée aux activités sportives ou à la santé, essaie de la ramener à ce contexte.]
      
      ${prompt}
    `;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: contextualizedPrompt
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, requestBody, { headers }).pipe(
      map((response: any) => {
        if (response && response.candidates && response.candidates.length > 0) {
          return response.candidates[0].content.parts[0].text || "Je n'ai pas de réponse à cette question concernant les activités sportives.";
        }
        return "Désolé, je n'ai pas pu générer une réponse sur ce sujet sportif.";
      }),
      catchError(error => {
        console.error('Erreur API Gemini:', error);
        return of(this.getFallbackResponse());
      })
    );
  }

  private getFallbackResponse(): string {
    const responses = [
      "La pratique régulière d'activités physiques est essentielle pour maintenir une bonne santé et prévenir de nombreuses maladies. Je suis là pour vous guider dans votre parcours fitness.",
      "Pour atteindre vos objectifs sportifs, il est important de combiner une alimentation équilibrée et un programme d'exercices adapté à votre niveau. Comment puis-je vous aider dans votre routine ?",
      "Suivre vos activités sportives régulièrement vous permet de mesurer vos progrès et de rester motivé. Notre application vous accompagne dans cette démarche.",
      "Une bonne récupération est aussi importante que l'entraînement lui-même. N'oubliez pas d'inclure des jours de repos dans votre planning d'activités."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
} 