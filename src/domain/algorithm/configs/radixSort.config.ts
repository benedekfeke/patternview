import { AlgorithmConfig } from '../algorithm.types';

// TODO: figure out how to edit this page from /dashboard/page
export const radixSortConfig: AlgorithmConfig = {
  sceneName: 'RadixSort',
  title: 'Sorting Algorithm',
  description: `<a href='https://en.wikipedia.org/wiki/Pathfinding' class="link-hover">Radix Sort</a> algorithms find the shortest path between two points in a graph or grid.`,
  modalDescription: [
    { text: 'Pathfinding' , link: 'https://en.wikipedia.org/wiki/Pathfinding' },
    { text: ' or pathing is the search, by a computer application, for the shortest route between two points. It is a more practical variant of solving ' },
    { text: 'mazes', link: 'https://en.wikipedia.org/wiki/Maze' },
    { text: '. This field of research is based heavily on ' },
    { text: "Dijkstra's algorithm", link: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm' },
    { text: ' for finding the shortest path on a weighted graph. ' },
    { text: '<br/><br/>Pathfinding is closely related to the shortest path problem within ' },
    { text: 'graph theory', link: 'https://en.wikipedia.org/wiki/Graph_theory' },
    { text: ', which examines how to identify the path that best meets some criteria between two points in a large network.' }
  ],
  pseudocodes: {
    OnRadixStateChanged: {
      title: "Reset game with current graph",
      code: ``
    },
    OnDigitSelected: {
      title: "Generate a new graph with randomized nodes and connections",
      code: ``
    },
    OnLetterMovedToBin: {
      title: "Step until the goal node is not found",
      code: ``
    },
    OnLetterCollected: {
      title: "No path exists further",
      code: ``
    },
    OnPassComplete: {
      title: "Algorithm found optimal path",
      code: ``
    },
    OnRadixSortComplete: {
      title: "Player found a path",
      code: ``
    },
    OnLetterInitialized: {
      title: "Compare paths",
      code: ``
    }
  },
  operations: ['OnRadixStateChanged', 'OnDigitSelected', 'OnLetterMovedToBin', 'OnLetterCollected', 'OnPassComplete', 'OnRadixSortComplete', 'OnLetterInitialized'],
  explanationRules: {
    empty: "The objective is to find the goal node",
    hasItems: "TODO",
    default: "TODO"
  }
}
