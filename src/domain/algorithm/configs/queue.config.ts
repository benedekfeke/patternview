
import { AlgorithmConfig } from '../algorithm.types';

export const queueConfig: AlgorithmConfig = {
  sceneName: 'Queue',
  title: 'Queue Data Structure',
  description: `A <a href='https://en.wikipedia.org/wiki/Queue_(abstract_data_type)' class="link-hover">QUEUE</a> is an organized group of objects where new items are added at one end, known as the rear, and old items are taken out at the other end, known as the front. It follows the <a href='https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' class="link-hover">First-In-First-Out (FIFO)</a> principle.`,
  modalDescription: [
    { text: 'In ' },
    { text: 'computer science', link: 'https://en.wikipedia.org/wiki/Computer_science' },
    { text: ', a queue is an ' },
    { text: 'abstract data type', link: 'https://en.wikipedia.org/wiki/Abstract_data_type' },
    { text: ' that serves as an ordered ' },
    { text: 'collection', link: 'https://en.wikipedia.org/wiki/Collection_(abstract_data_type)' },
    { text: ' of entities. By convention, the end of the queue where elements are added is called the <b>back</b>, <b>tail</b>, or <b>rear</b>. The end where elements are removed is called the <b>head</b> or <b>front</b>.' },
    { text: '<br/><br/><b>Core Operations:</b><br/>' },
    { text: '• <b>Enqueue:</b> Adds an element to the rear of the queue — O(1) time<br/>' },
    { text: '• <b>Dequeue:</b> Removes and returns the element at the front — O(1) time<br/>' },
    { text: '• <b>Peek/Front:</b> Returns the front element without removing it — O(1) time<br/>' },
    { text: '• <b>IsEmpty:</b> Checks if the queue has no elements — O(1) time' },
    { text: '<br/><br/>The operations of a queue make it a ' },
    { text: 'first-in-first-out (FIFO) data structure', link: 'https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' },
    { text: '. Think of it like a line at a store — the first person to join the line is the first to be served.' },
    { text: '<br/><br/><b>Implementation Approaches:</b><br/>' },
    { text: '• <b>Array-based:</b> Simple but may require resizing or use a ' },
    { text: 'circular buffer', link: 'https://en.wikipedia.org/wiki/Circular_buffer' },
    { text: ' to avoid wasted space<br/>' },
    { text: '• <b>Linked list:</b> Dynamic sizing with ' },
    { text: 'linked lists', link: 'https://en.wikipedia.org/wiki/Linked_list' },
    { text: ', no size limits but uses more memory per element' },
    { text: '<br/><br/><b>Queue Variations:</b><br/>' },
    { text: '• ' },
    { text: 'Priority Queue', link: 'https://en.wikipedia.org/wiki/Priority_queue' },
    { text: ' — elements are dequeued based on priority, not arrival order<br/>' },
    { text: '• ' },
    { text: 'Double-ended Queue (Deque)', link: 'https://en.wikipedia.org/wiki/Double-ended_queue' },
    { text: ' — allows insertion and removal at both ends<br/>' },
    { text: '• ' },
    { text: 'Circular Queue', link: 'https://en.wikipedia.org/wiki/Circular_buffer' },
    { text: ' — wraps around to reuse array space efficiently<br/>' },
    { text: '• <b>Blocking Queue</b> — thread-safe queue used in ' },
    { text: 'concurrent programming', link: 'https://en.wikipedia.org/wiki/Concurrent_computing' },
    { text: '<br/><br/><b>Real-World Applications:</b><br/>' },
    { text: '• <b>Print Spooling:</b> Documents are printed in the order they were submitted<br/>' },
    { text: '• <b>Task Scheduling:</b> ' },
    { text: 'Operating systems', link: 'https://en.wikipedia.org/wiki/Operating_system' },
    { text: ' use queues to manage processes waiting for CPU time<br/>' },
    { text: '• <b>Breadth-First Search:</b> ' },
    { text: 'BFS algorithm', link: 'https://en.wikipedia.org/wiki/Breadth-first_search' },
    { text: ' uses a queue to explore nodes level by level<br/>' },
    { text: '• <b>Message Queues:</b> Systems like ' },
    { text: 'RabbitMQ', link: 'https://en.wikipedia.org/wiki/RabbitMQ' },
    { text: ' and ' },
    { text: 'Apache Kafka', link: 'https://en.wikipedia.org/wiki/Apache_Kafka' },
    { text: ' handle asynchronous communication<br/>' },
    { text: '• <b>Buffering:</b> Video streaming uses queues to buffer frames before playback' },
    { text: '<br/><br/><b>Comparison with Stack:</b><br/>' },
    { text: 'While a queue is FIFO, a ' },
    { text: 'stack', link: 'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)' },
    { text: ' is LIFO (Last-In-First-Out). Use a queue when order of arrival matters; use a stack when you need to process the most recent item first (like undo operations).' }
  ],

  pseudocodes: {
    Enqueue: {
      title: "Add item to rear of queue",
      code: `<span class="keyword">function</span> <span class="fn">Enqueue</span>(item) {<br/>&nbsp;&nbsp;queue[rear] ← item<br/>&nbsp;&nbsp;rear ← rear + 1<br/>&nbsp;&nbsp;size ← size + 1<br/>}`,
      tooltip: `Enqueue adds a new element to the back (rear) of the queue.Analogy: Like joining a line at a ticket counter — you go to the end and wait your turn.`
    },
    Dequeue: {
      title: "Remove item from front of queue",
      code: `<span class="keyword">function</span> <span class="fn">Dequeue</span>() {<br/>&nbsp;&nbsp;<span class="keyword">if</span> (size == 0) <span class="keyword">return null</span><br/>&nbsp;&nbsp;item ← queue[front]<br/>&nbsp;&nbsp;front ← front + 1<br/>&nbsp;&nbsp;size ← size - 1<br/>&nbsp;&nbsp;<span class="keyword">return</span> item<br/>}`,
      tooltip: `Dequeue removes and returns the element at the front of the queue.Analogy: The person at the front of the line gets served and leaves.`
    }
  },
  operations: ['Enqueue', 'Dequeue'],
  explanationRules: {
    empty: "The queue is empty. Dequeue operation cannot be performed.",
    hasItems: "Queue has items. All operations can be performed.",
    default: "Queue operation"
  }
};
