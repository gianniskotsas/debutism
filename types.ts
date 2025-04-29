export interface Post {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
  thumbnail: {
    url: string;
  };
  website: string;
}

export interface Newsletter {
  productsOfTheDay: Post[];
  productsOfTheWeek: Post[];
}
