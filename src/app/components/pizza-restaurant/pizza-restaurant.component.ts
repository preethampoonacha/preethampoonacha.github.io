import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-pizza-restaurant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pizza-restaurant.component.html',
  styleUrl: './pizza-restaurant.component.css'
})
export class PizzaRestaurantComponent {
  pizzas: Pizza[] = [
    {
      id: 1,
      name: 'Margherita Classic',
      description: 'Fresh mozzarella, basil, and our signature tomato sauce',
      price: 12.99,
      image: '🍕',
      ingredients: ['Mozzarella', 'Basil', 'Tomato Sauce'],
      popular: true
    },
    {
      id: 2,
      name: 'Pepperoni Supreme',
      description: 'Spicy pepperoni, mozzarella, and a hint of oregano',
      price: 15.99,
      image: '🍕',
      ingredients: ['Pepperoni', 'Mozzarella', 'Oregano'],
      popular: true
    },
    {
      id: 3,
      name: 'Quattro Stagioni',
      description: 'Four seasons of flavor: mushrooms, ham, artichokes, and olives',
      price: 18.99,
      image: '🍕',
      ingredients: ['Mushrooms', 'Ham', 'Artichokes', 'Olives'],
    },
    {
      id: 4,
      name: 'Truffle Delight',
      description: 'Premium truffle oil, wild mushrooms, and aged parmesan',
      price: 24.99,
      image: '🍕',
      ingredients: ['Truffle Oil', 'Wild Mushrooms', 'Parmesan'],
    },
    {
      id: 5,
      name: 'Hawaiian Paradise',
      description: 'Sweet pineapple, ham, and mozzarella on a crispy crust',
      price: 16.99,
      image: '🍕',
      ingredients: ['Pineapple', 'Ham', 'Mozzarella'],
    },
    {
      id: 6,
      name: 'Veggie Supreme',
      description: 'Bell peppers, onions, mushrooms, olives, and fresh herbs',
      price: 14.99,
      image: '🍕',
      ingredients: ['Bell Peppers', 'Onions', 'Mushrooms', 'Olives'],
    },
  ];

  selectedPizza: Pizza | null = null;

  selectPizza(pizza: Pizza) {
    this.selectedPizza = pizza;
  }

  closeModal() {
    this.selectedPizza = null;
  }

  addToCart(pizza: Pizza) {
    // Add to cart logic here
    alert(`Added ${pizza.name} to cart!`);
    this.closeModal();
  }

  scrollToMenu() {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

