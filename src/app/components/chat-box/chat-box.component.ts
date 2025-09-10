import { Component, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
    standalone: false,
})
export class ChatBoxComponent implements OnInit {
  @Output() clickOutside = new EventEmitter<void>();
  messages: Message[] = [];
  userInput = '';
  intervalInput = '';
  messageInput = '';
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessages().subscribe(msgs => {
      this.messages = msgs;
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    const trimmed = this.userInput.trim();
    if (!trimmed) return;

    this.chatService.sendMessage(trimmed).subscribe(() => {
      this.userInput = '';
      this.scrollToBottom();
    });
  }

  submitMissingValues(): void {
    const lastBotMsg = (() => {
      for (let i = this.messages.length - 1; i >= 0; i--) {
        const m = this.messages[i];
        if (m.sender === 'bot' && m.agent === 'task') {
          return m;
        }
      }
      return undefined;
    })();
    if (!lastBotMsg || !lastBotMsg.context) return;

    const enrichedContext = {
      ...lastBotMsg.context,
      interval: this.intervalInput || lastBotMsg.context.interval,
      message: this.messageInput || lastBotMsg.context.message
    };

    this.chatService.sendMessage('Here are the missing details', enrichedContext).subscribe(() => {
      this.intervalInput = '';
      this.messageInput = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messageContainer?.nativeElement;
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

  get lastTaskContext() {
  const lastTask = [...this.messages].reverse().find(m => m.sender === 'bot' && m.agent === 'task');
  return lastTask?.context;
}
}
