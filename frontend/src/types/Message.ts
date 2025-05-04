export interface Message {
    id: number;
    user_id?: string;
    nickname: string;
    text: string;
    timestamp: string;
    likes: number;
    dislikes: number;
    parent_id?: number;
    replyCount?: number;
  }
  