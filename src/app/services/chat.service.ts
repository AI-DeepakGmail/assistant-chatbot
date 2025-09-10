import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message, N8nResponse } from '../models/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ChatService {
  private messages: Message[] = [];
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private webhookUrl = 'http://localhost:5678/webhook-test/agent-router';
  private lastContext: any = null;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  sendMessage(userInput: string, contextOverride?: any): Observable<Message> {
    const userMessage: Message = {
      sender: 'user',
      content: userInput,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.messagesSubject.next([...this.messages]);

    const payload = contextOverride
      ? { text: userInput, context: contextOverride }
      : this.lastContext
        ? { text: userInput, context: this.lastContext }
        : { text: userInput };

    return this.http.post<N8nResponse>(this.webhookUrl, payload).pipe(
      map(response => {
        this.lastContext = response.context || null;

        let _content = '';
        if (response.agent === 'query') {
          const extractedAnswer = this.extractFinalAnswer(response.answer);
          _content = `${extractedAnswer}\n⏱️ Response time: ${response.response_time_sec.toFixed(2)} sec`;
        } else {
          _content = response.output;
        }

        const botMessage: Message = {
          sender: 'bot',
          content: _content,
          timestamp: new Date(),
          agent: response.agent,
          context: response.context
        };

        this.messages.push(botMessage);
        this.messagesSubject.next([...this.messages]);
        return botMessage;
      })
    );
  }

  extractFinalAnswer(raw: string): string {
    const match = raw.match(/Answer:\s*(.*)/i);
    return match ? match[1].trim() : raw;
  }
}
