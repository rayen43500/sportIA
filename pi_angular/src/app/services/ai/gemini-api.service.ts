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
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
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
          return response.candidates[0].content.parts[0].text || "Je n'ai pas de réponse à cette question.";
        }
        return "Désolé, je n'ai pas pu générer une réponse.";
      }),
      catchError(error => {
        console.error('Erreur API Gemini:', error);
        return of(this.getFallbackResponse());
      })
    );
  }

  private getFallbackResponse(): string {
    const responses = [
      "Je comprends votre demande. Laissez-moi vous aider avec cela.",
      "C'est une excellente question ! Voici ce que je peux vous dire...",
      "Je vais vous guider à travers ce processus.",
      "Permettez-moi de clarifier ce point pour vous."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
} 