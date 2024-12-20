export interface Book {
    rating: {
      average: number;
      count: number;
    };
    title: string;
    author: string;
    publishedDate: Date;
    publisher: string;
    description: string;
    coverImage: string;
    tags: string[];
    initialQty: number;
    qty: number;
  }
  