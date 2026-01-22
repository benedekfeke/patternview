import { AlgorithmConfig } from '../algorithm.types';

// TODO: figure out how to edit this page from /dashboard/page
export const pathfindingConfig: AlgorithmConfig = {
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
    { text: '<br/><br/>Pathfinding is closely related to the shortest path problem within ' },
    { text: 'graph theory', link: 'https://en.wikipedia.org/wiki/Graph_theory' },
    { text: ', which examines how to identify the path that best meets some criteria between two points in a large network.' }
  ],
  pseudocodes: {
    OnSceneRestarted: {
      title: "Reset game with current graph",
      code: `function Reset()`
    },
    OnGraphRandomized: {
      title: "Generate a new graph with randomized nodes and connections",
      code: `function GenerateNewGraph(int nodeCount)`
    },
    OnStepForward: {
      title: "Step until the goal node is not found",
      code: `function StepForward() {<br/>&nbsp;&nbsp;foreach (var edge in current.edges)<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;Node neighbor = edge.GetOtherNode(current);<br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!neighbor.visited)<br/>&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;float newDist = current.distance + edge.weight;<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (newDist &lt; neighbor.distance)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.distance = newDist;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.previous = current;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}<br/>}`
    },
    OnNoPathExists: {
      title: "No path exists further",
      code: `if (current.distance == Mathf.Infinity)<br/>{<br/>&nbsp;&nbsp;break; // No path exists<br/>}`
    },
    OnAlgoPathFound: {
      title: "Algorithm found optimal path",
      code: `function SolveDijkstra(grid) {<br/>&nbsp;&nbsp;...<br/>}`
    },
    OnPlayerPathFound: {
      title: "Player found a path",
      code: `// Player reached goal node`
    },
    PathsComparison: {
      title: "Compare paths",
      code: `// Comparing greedy vs Dijkstra`
    }
  },
  //TODO: get comparison of dijkstra vs greedy(user) pathlenghts from dispatch
  operations: ['OnSceneRestarted', 'OnGraphRandomized', 'OnStepForward', 'OnNoPathExists', 'PathsComparison'],
  explanationRules: {
    empty: "The objective is to find the goal node",
    hasItems: "TODO",
    default: "TODO"
  }
}
