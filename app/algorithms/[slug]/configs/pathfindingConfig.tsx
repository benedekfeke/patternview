import { DescriptionSegment } from '@/app/components/DescriptionModal';


// TODO: figure out how to edit this page from /dashboard/page
export const pathfindingConfig = {
  sceneName: 'Pathfinding',
  title: 'Pathfinding algorithm',
  description: `<a href='https://en.wikipedia.org/wiki/Pathfinding' class="link-hover">PATHFINDING</a> algorithms find the shortest path between two points in a graph or grid.`,
  modalDescription: [
    { text: 'Pathfinding' , link: 'https://en.wikipedia.org/wiki/Pathfinding' },
    { text: ' or pathing is the search, by a computer application, for the shortest route between two points. It is a more practical variant of solving ' },
    { text: 'mazes', link: 'https://en.wikipedia.org/wiki/Maze' },
    { text: '. This field of research is based heavily on ' },
    { text: "Dijkstra's algorithm", link: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm' },
    { text: ' for finding the shortest path on a weighted graph. ' },
    { text: '\n\nPathfinding is closely related to the shortest path problem within ' },
    { text: 'graph theory', link: 'https://en.wikipedia.org/wiki/Graph_theory' },
    { text: ', which examines how to identify the path that best meets some criteria between two points in a large network.' }
  ] as DescriptionSegment[],
  operations: ['Reset', 'GenerateNewGraph', 'FindPath'],
  pseudocodes: [
    {
      title: "Reset game with current graph",
      code: `function Reset()`
    },
    {
      title: "Generate a new graph with randomized nodes and connections",
      code: `function GenerateNewGraph(int nodeCount)`
    },
    {
      title: "Find an optimal, but not fastest path",
      code: `function SolveDijkstra(grid) {<br/> &nbsp;&nbsp;...<br/>}`,
    }
  ],
  //TODO: get comparison of dijkstra vs greedy(user) pathlenghts from dispatch
  explanataionRules: {
    start: "The objective is to find the goal node",
    found: ""
  }
}
