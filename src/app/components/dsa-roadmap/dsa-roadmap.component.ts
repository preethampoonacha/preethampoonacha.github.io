import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DsaTopic {
  id: string;
  title: string;
  character: string;
  description: string;
  concept: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dsa-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dsa-roadmap.component.html',
  styleUrls: ['./dsa-roadmap.component.css']
})
export class DsaRoadmapComponent {
  topics: DsaTopic[] = [
    {
      id: 'arrays',
      title: 'Arrays',
      character: 'Henry the Penguin',
      description: 'Henry loves things neat and orderly! An Array is just like Henry’s spoon collection: a fixed number of items lined up perfectly next to each other in memory.',
      concept: 'A contiguous block of memory to store elements of the same type.',
      icon: '🥄',
      color: '#4fc3f7'
    },
    {
      id: 'linked-lists',
      title: 'Linked Lists',
      character: 'Weenie the Dog',
      description: 'Weenie is chasing a magical string of sausages! Each sausage (Node) holds some meat (Data) and a string pointing to the next sausage (Pointer).',
      concept: 'A sequence of elements where each element points to the next, allowing dynamic memory allocation.',
      icon: '🌭',
      color: '#ffb74d'
    },
    {
      id: 'stacks',
      title: 'Stacks',
      character: 'Oswald',
      description: 'Oswald is making a tall stack of pancakes. He adds a new pancake on top (Push), and when he wants to eat, he takes the top one off (Pop). Last pancake on is the first to be eaten!',
      concept: 'A LIFO (Last-In-First-Out) data structure.',
      icon: '🥞',
      color: '#64b5f6'
    },
    {
      id: 'queues',
      title: 'Queues',
      character: 'Madame Butterfly',
      description: 'Customers are waiting in line at Madame Butterfly\'s Diner. The first customer who gets in line (Enqueue) is the first one served (Dequeue).',
      concept: 'A FIFO (First-In-First-Out) data structure.',
      icon: '🦋',
      color: '#f06292'
    },
    {
      id: 'trees',
      title: 'Trees',
      character: 'Daisy',
      description: 'Daisy the sunflower starts as a single root, then branches out to her beautiful leaves. Trees help us organize things hierarchically, like a family tree or a sunny plant!',
      concept: 'A hierarchical data structure with a root node and child nodes.',
      icon: '🌻',
      color: '#81c784'
    },
    {
      id: 'graphs',
      title: 'Graphs',
      character: 'Big City',
      description: 'The map of Big City! Oswald’s house, Henry’s apartment, and the diner are connected by roads. A Graph is just places (Vertices) connected by paths (Edges).',
      concept: 'A collection of nodes and edges connecting them, used to model networks.',
      icon: '🏙️',
      color: '#ba68c8'
    }
  ];

  selectedTopic: DsaTopic = this.topics[0];

  selectTopic(topic: DsaTopic) {
    this.selectedTopic = topic;
  }
}
