import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiApiService } from 'src/app/services/ai/gemini-api.service';

interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private messagesContainer!: ElementRef;

  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  isTyping = false;

  constructor(
    private fb: FormBuilder,
    private geminiApiService: GeminiApiService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Ajouter un message de bienvenue
    this.addMessage('Bonjour ! Je suis votre assistant IA spécialisé dans les activités sportives et le mode de vie sain. Comment puis-je vous aider aujourd\'hui ?', 'ai');
    
    // Démonstration de l'API Gemini au démarrage avec une question pertinente sur les activités sportives
    this.demonstrateGeminiApi();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private addMessage(content: string, sender: 'user' | 'ai'): void {
    this.messages.push({
      content,
      sender,
      timestamp: new Date()
    });
  }

  onSubmit(): void {
    if (this.chatForm.valid) {
      const userMessage = this.chatForm.get('message')?.value.trim();
      
      // Ajouter le message de l'utilisateur
      this.addMessage(userMessage, 'user');
      
      // Réinitialiser le formulaire
      this.chatForm.reset();
      
      // Indiquer que l'IA est en train de répondre
      this.isTyping = true;
      
      // Appeler l'API Gemini via le service
      this.geminiApiService.generateContent(userMessage).subscribe({
        next: (response) => {
          this.addMessage(response, 'ai');
        },
        error: (error) => {
          console.error('Erreur lors de la génération de la réponse:', error);
          this.addMessage('Désolé, une erreur est survenue. Veuillez réessayer.', 'ai');
        },
        complete: () => {
          this.isTyping = false;
        }
      });
    }
  }

  // Démonstration de l'API Gemini au démarrage du chat
  private demonstrateGeminiApi(): void {
    this.isTyping = true;
    
    setTimeout(() => {
      const prompt = `
        Tu es un assistant spécialisé dans la gestion des activités sportives et le mode de vie sain.
        Fournir une brève explication (maximum 3 phrases) sur l'importance de suivre régulièrement ses activités physiques et comment cela contribue à un mode de vie sain.
        Donne aussi un conseil pratique pour débutants.
      `;
      
      this.geminiApiService.generateContent(prompt).subscribe({
        next: (response) => {
          this.addMessage(response, 'ai');
        },
        error: (error) => {
          console.error('Erreur lors de la démonstration:', error);
          this.addMessage("Suivre régulièrement vos activités physiques est essentiel pour maintenir une bonne santé, améliorer votre humeur et réduire les risques de maladies chroniques. Notre application vous aide à planifier, suivre et analyser vos performances sportives pour atteindre vos objectifs plus efficacement. Pour les débutants, commencez par 20 minutes d'activité modérée trois fois par semaine et augmentez progressivement l'intensité et la durée.", 'ai');
        },
        complete: () => {
          this.isTyping = false;
        }
      });
    }, 1500);
  }

  closeChat(): void {
    const modalElement = document.getElementById('aiChatModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
} 