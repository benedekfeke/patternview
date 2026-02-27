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
      code: `function Reset()`,
      tooltip: `Resets the current pathfinding session while keeping the same graph structure. Clears all visited nodes and paths.`
    },
    OnGraphRandomized: {
      title: "Generate a new graph with randomized nodes and connections",
      code: `function GenerateNewGraph(int nodeCount)`,
      tooltip: `Creates a completely new random graph with the specified number of nodes and weighted edges.`
    },
    OnStepForward: {
      title: "Step until the goal node is not found",
      code: `function StepForward() {<br/>&nbsp;&nbsp;foreach (var edge in current.edges)<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;Node neighbor = edge.GetOtherNode(current);<br/>&nbsp;&nbsp;&nbsp;&nbsp;if (!neighbor.visited)<br/>&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;float newDist = current.distance + edge.weight;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (newDist &lt; neighbor.distance)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.distance = newDist;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.previous = current;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}<br/>}`,
      tooltip: `Stepping forward - searching for all the neighbors of the current node and "exploring them" one by one.`
    },
    OnNoPathExists: {
      title: "No path exists further",
      code: `if (current.distance == Mathf.Infinity)<br/>
      &nbsp;&nbsp;emit NoPathFound<br/>
      &nbsp;&nbsp;break<br/>`,
      tooltip: `It's good practice to initialize the node distances to Infinity, so if we can not measure a smaller than infinity distance between 2 nodes, we can conclude that no path exists between the 2 nodes.`,
    },
    OnAlgoPathFound: {
      title: "Algorithm found optimal path",
      code: `while (unvisitedNodes.Count > 0)<br/>
      &nbsp;&nbsp;currentNode ← StepForward()<br/>,
      &nbsp;&nbsp;currentNode.visited ← true<br/>,
      &nbsp;&nbsp;if (currentNode == goalNode)
      &nbsp;&nbsp;&nbsp;&nbsp;emit AlgorithmPathFound
      &nbsp;&nbsp;&nbsp;&nbsp;break<br/>`,
      tooltip: `A shortest path algorithm (Dijkstra's algorithm in our case, see more in description above) found the shortest path from <b>startNode<b/> to <b>goalNode<b/>.`,
    },
    OnPlayerPathFound: {
      title: "Player found a path",
      code: `// Player reached goal node`,
      tooltip: `The player manually navigated to the goal node using a greedy approach (always choosing the nearest unvisited neighbor).`
    },
    PathsComparison: {
      title: "Compare paths",
      code: `// Comparing greedy vs Dijkstra`,
      tooltip: `Compares the player's greedy path length against Dijkstra's optimal shortest path to show the difference in efficiency.`
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
