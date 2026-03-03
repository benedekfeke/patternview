
import { AlgorithmConfig } from '../algorithm.types';

export const queueConfig: AlgorithmConfig = {
  sceneName: 'Queue',
  title: 'Queue Data Structure',
  description: `A <a href='https://en.wikipedia.org/wiki/Queue_(abstract_data_type)' class="link-hover">QUEUE</a> is an organized group of objects where new items are added at one end, known as the rear, and old items are taken out at the other end, known as the front. It follows the <a href='https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' class="link-hover">First-In-First-Out (FIFO)</a> principle.`,
  modalDescription: [
    { text: 'In ' },
    { text: 'computer science', link: 'https://en.wikipedia.org/wiki/Computer_science' },
    { text: ', a queue is an abstract data type that serves as an ordered ' },
    { text: 'collection', link: 'https://en.wikipedia.org/wiki/Collection_(abstract_data_type)' },
    { text: ' of entities. By convention, the end of the queue where elements are added is called the back, tail, or rear of the queue. The end where elements are removed is called the head or front. ' },
    { text: '\n\nIt supports two main operations: Enqueue (adds an element to the rear) and Dequeue (removes an element from the front). ' },
    { text: '\n\nThe operations of a queue make it a ' },
    { text: 'first-in-first-out (FIFO) data structure', link: 'https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' },
    { text: '. A queue is an example of a ' },
    { text: 'linear data structure', link: 'https://en.wikipedia.org/wiki/Linear_data_structure' },
    { text: '. Queues may be implemented as ' },
    { text: 'circular buffers', link: 'https://en.wikipedia.org/wiki/Circular_buffer' },
    { text: ' or ' },
    { text: 'linked lists', link: 'https://en.wikipedia.org/wiki/Linked_list' },
    { text: '.' }
  ],

  pseudocodes: {
    Enqueue: {
      title: "Add item to rear of queue",
      code: `<span class="keyword">function</span> <span class="fn">Enqueue</span>(item) {<br/>&nbsp;&nbsp;queue[rear] ← item<br/>&nbsp;&nbsp;rear ← rear + 1<br/>&nbsp;&nbsp;size ← size + 1<br/>}`,
      tooltip: `<b>Enqueue</b> adds a new element to the back (rear) of the queue.<br/><br/><i>Analogy:</i> Like joining a line at a ticket counter — you go to the end and wait your turn.`
    },
    Dequeue: {
      title: "Remove item from front of queue",
      code: `<span class="keyword">function</span> <span class="fn">Dequeue</span>() {<br/>&nbsp;&nbsp;<span class="keyword">if</span> (size == 0) <span class="keyword">return null</span><br/>&nbsp;&nbsp;item ← queue[front]<br/>&nbsp;&nbsp;front ← front + 1<br/>&nbsp;&nbsp;size ← size - 1<br/>&nbsp;&nbsp;<span class="keyword">return</span> item<br/>}`,
      tooltip: `<b>Dequeue</b> removes and returns the element at the front of the queue.<br/><br/><i>Analogy:</i> The person at the front of the line gets served and leaves.`
    }
  },
  operations: ['Enqueue', 'Dequeue'],
  explanationRules: {
    empty: "The queue is empty. Dequeue operation cannot be performed.",
    hasItems: "Queue has items. All operations can be performed.",
    default: "Queue operation"
  }
};
