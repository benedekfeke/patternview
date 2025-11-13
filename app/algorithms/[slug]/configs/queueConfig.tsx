
export const queueConfig = {
  sceneName: 'Queue',
  title: 'Queue Data Structure',
  description: `A <a href='https://en.wikipedia.org/wiki/Queue_(abstract_data_type)' class="underline hover:bg-black hover:text-white transition-all ease-in duration-300 cursor-pointer">QUEUE</a> is an organized group of objects where new items are added at one end, known as the rear, and old items are taken out at the other end, known as the front. It follows the <a href='https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' class="underline hover:bg-black hover:text-white transition-all ease-in duration-300 cursor-pointer">First-In-First-Out (FIFO)</a> principle.`,
  operations: ['Enqueue', 'Dequeue'],
  pseudocodes: [
    {
      title: "Enqueue Operation",
      code: `function enqueue(queue, item) {<br />&nbsp;&nbsp;queue.push(item);<br />&nbsp;&nbsp;return queue;<br />}`,
    },
    {
      title: "Dequeue Operation",
      code: `function dequeue(queue) {<br />&nbsp;&nbsp;if (queue.length === 0) {<br />&nbsp;&nbsp;&nbsp;&nbsp;throw new Error("Queue is empty");<br />&nbsp;&nbsp;}<br />&nbsp;&nbsp;return queue.shift();<br />}`,
    },
    //TODO: ADD MORE LATER
  ],
  // Define explanation rules as data instead of function
  explanationRules: {
    empty: "The queue is empty. Dequeue operation cannot be performed successfully.",
    hasItems: "Queue has items. Operations can be performed.",
    default: "Default explanation"
  }
};
