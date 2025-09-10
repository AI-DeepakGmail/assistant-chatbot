export interface Message {
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  agent?: string;
  context?: {
    name?: string;
    interval?: string | null;
    time_of_day?: string | null;
    repeat?: boolean;
    message?: string | null;
  };
}


export interface N8nResponse {
  output: string;
  answer: string;
  question: string;
  response_time_sec: number;
  agent :string;
 context?: {
    name?: string;
    interval?: string | null;
    time_of_day?: string | null;
    repeat?: boolean;
    message?: string | null;
  };
}
