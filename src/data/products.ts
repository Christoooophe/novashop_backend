export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export const products: Product[] = [
  { id: 1, name: 'T-shirt NovaShop', price: 19.9, stock: 50, category: 'Vetements' },
  { id: 2, name: 'Mug NovaShop', price: 9.5, stock: 120, category: 'Maison' },
  { id: 3, name: 'Casquette NovaShop', price: 14.0, stock: 0, category: 'Vetements' },
];
