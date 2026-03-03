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
      title: "Reset pathfinding state",
      code: `<span class="keyword">function</span> <span class="fn">Reset</span>() {<br/>&nbsp;&nbsp;visited[] ← <span class="keyword">false</span><br/>&nbsp;&nbsp;distances[] ← ∞<br/>&nbsp;&nbsp;previous[] ← <span class="keyword">null</span><br/>}`,
      tooltip: `Resets all nodes to their initial state. All distances are set to infinity, all visited flags cleared, and path references removed.`
    },
    OnGraphRandomized: {
      title: "Generate random weighted graph",
      code: `<span class="keyword">function</span> <span class="fn">GenerateGraph</span>(nodeCount) {<br/>&nbsp;&nbsp;nodes ← <span class="fn">createNodes</span>(nodeCount)<br/>&nbsp;&nbsp;edges ← <span class="fn">connectNodes</span>(nodes)<br/>&nbsp;&nbsp;<span class="keyword">return</span> Graph(nodes, edges)<br/>}`,
      tooltip: `Creates a new random graph with the specified number of nodes. Each edge has a randomly assigned weight representing the cost to traverse it.`
    },
    OnStepForward: {
      title: "Explore neighbors of current node",
      code: `<span class="keyword">function</span> <span class="fn">StepForward</span>(current) {<br/>&nbsp;&nbsp;<span class="keyword">for each</span> edge <span class="keyword">in</span> current.edges {<br/>&nbsp;&nbsp;&nbsp;&nbsp;neighbor ← edge.getOtherNode(current)<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span> (!neighbor.visited) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;newDist ← current.dist + edge.weight<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span> (newDist &lt; neighbor.dist) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.dist ← newDist<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;neighbor.prev ← current<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}<br/>}`,
      tooltip: `<b>Relaxation step</b> in Dijkstra's algorithm. For each unvisited neighbor, we check if going through the current node provides a shorter path. If so, we update the distance and store the path.`
    },
    OnNoPathExists: {
      title: "No path exists to goal",
      code: `<span class="keyword">if</span> (current.dist == ∞) {<br/>&nbsp;&nbsp;<span class="fn">emit</span>(<span class="string">'NoPathFound'</span>)<br/>&nbsp;&nbsp;<span class="keyword">break</span><br/>}`,
      tooltip: `When all reachable nodes have been visited and the goal's distance remains infinity, it means no path exists between start and goal nodes.`,
    },
    OnAlgoPathFound: {
      title: "Shortest path found by algorithm",
      code: `<span class="keyword">while</span> (unvisited.length &gt; 0) {<br/>&nbsp;&nbsp;current ← <span class="fn">getMinDistance</span>(unvisited)<br/>&nbsp;&nbsp;current.visited ← <span class="keyword">true</span><br/>&nbsp;&nbsp;<span class="keyword">if</span> (current == goal) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">emit</span>(<span class="string">'PathFound'</span>)<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><br/>&nbsp;&nbsp;}<br/>&nbsp;&nbsp;<span class="fn">StepForward</span>(current)<br/>}`,
      tooltip: `Dijkstra's algorithm found the optimal shortest path. The algorithm always picks the unvisited node with the smallest distance, guaranteeing the shortest path.`,
    },
    OnPlayerPathFound: {
      title: "Player reached the goal",
      code: `<span class="comment">// Player navigated to goal</span><br/>playerPath ← <span class="fn">reconstructPath</span>(goal)<br/>playerDist ← goal.dist`,
      tooltip: `The player manually selected nodes to reach the goal. This path may be longer than optimal since humans often use a <b>greedy approach</b> (picking the nearest visible node).`
    },
    PathsComparison: {
      title: "Compare greedy vs optimal paths",
      code: `<span class="comment">// Path length comparison</span><br/>difference ← playerDist - algoDist<br/>efficiency ← algoDist / playerDist * 100`,
      tooltip: `Compares the player's path length against Dijkstra's optimal path. Shows how close the greedy approach got to the mathematically shortest route.`
    }
  },
  //TODO: get comparison of dijkstra vs greedy(user) pathlenghts from dispatch
  operations: ['OnSceneRestarted', 'OnGraphRandomized', 'OnStepForward', 'OnNoPathExists', 'OnAlgoPathFound', 'OnPlayerPathFound', 'PathsComparison'],
  explanationRules: {
    empty: "The objective is to find the goal node",
    hasItems: "TODO",
    default: "TODO"
  }
}
