export const pathfindingConfig = {
  sceneName: 'Pathfinding',
  title: 'Pathfinding algorithm',
  description: `<a href='https://en.wikipedia.org/wiki/Pathfinding' class="underline hover:bg-black hover:text-white transition-all ease-in duration-300 cursor-pointer">PATHFINDING</a> algorithms find the shortest path between two points in a graph or grid.`,
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
      code: `function SolveDijkstra(grid)`
    }
  ],
  //TODO: get comparison of dijkstra vs greedy(user) pathlenghts from dispatch
}
