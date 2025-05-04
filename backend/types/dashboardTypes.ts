export interface DashboardPost {
    id: number;
    user_id?: number;
    nickname: string;
    text: string;
    timestamp: string;
    likes: number;
    dislikes: number;
    parent_id?: number;
  }
  
  export interface DashboardHashtag {
    tag: string;
    count: number;
  }
  
  export interface DashboardUserRanking {
    user_id: number;
    nickname: string;
    messages: number;
    total_likes: number;
    total_dislikes: number;
  }
  
  export interface DashboardMetrics {
    mostLiked: DashboardPost | null;
    mostDisliked: DashboardPost | null;
    topHashtags: DashboardHashtag[];
    userRanking: DashboardUserRanking[];
  }
  