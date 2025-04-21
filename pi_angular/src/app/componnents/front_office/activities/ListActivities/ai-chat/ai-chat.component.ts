import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Ajouter un message de bienvenue
    this.addMessage('Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?', 'ai');
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

  async onSubmit(): Promise<void> {
    if (this.chatForm.valid) {
      const userMessage = this.chatForm.get('message')?.value.trim();
      
      // Ajouter le message de l'utilisateur
      this.addMessage(userMessage, 'user');
      
      // Réinitialiser le formulaire
      this.chatForm.reset();
      
      // Simuler la réponse de l'IA
      this.isTyping = true;
      
      try {
        // Ici, vous pouvez intégrer votre logique d'IA
        // Pour l'instant, nous simulons une réponse après un délai
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const aiResponse = this.generateAiResponse(userMessage);
        this.addMessage(aiResponse, 'ai');
      } catch (error) {
        console.error('Erreur lors de la génération de la réponse:', error);
        this.addMessage('Désolé, une erreur est survenue. Veuillez réessayer.', 'ai');
      } finally {
        this.isTyping = false;
      }
    }
  }

  private generateAiResponse(userMessage: string): string {
    // Cette méthode devrait être remplacée par votre logique d'IA réelle
    const responses = [
      "Je comprends votre demande. Laissez-moi vous aider avec cela.",
      "C'est une excellente question ! Voici ce que je peux vous dire...",
      "Je vais vous guider à travers ce processus.",
      "Permettez-moi de clarifier ce point pour vous."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  closeChat(): void {
    // Implémentez la logique de fermeture du chat ici
    // Par exemple, émettre un événement pour informer le composant parent
  }
} 