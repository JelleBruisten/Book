export interface Book {
  isbn: number;
  title: string;
  author: string;
  publish_date: Date;
  publisher: string;
  numOfPages: number;
  cover: string;
  introduction: string;
}

export const bookProperties = [
  'isbn',
  'title',
  'author',
  'publish_date',
  'publisher',
  'numOfPages',
  'cover',
  'introduction',
];
