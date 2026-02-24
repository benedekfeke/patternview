import { AlgorithmConfig } from "../algorithm.types";

export const trieConfig: AlgorithmConfig = {
  sceneName: 'Trie',
  title: 'Trie Data Structure',
  description: `A trie (pronounced “try”) is a tree-based data structure that stores strings efficiently by sharing common prefixes. Also called a prefix tree, a trie enables fast string search, insertion, and deletion operations in O(L) time, where L is the string length.`,
  modalDescription: [
    {text: 'In a trie:<br/>Each node represents a single character.The path from the root to any node forms a prefix of one or more strings. Words that share prefixes use shared paths, making the structure space-efficient. We mark the end of a complete word using a special flag.</br>This structure saves memory and makes prefix-based search and autocomplete operations very efficient.</br></br>'},
    {text: "When you want to check if a word exists in a trie, follow its characters from the root. The search is successful if all characters match and the last one is marked as the end of a word. Otherwise, the word either doesn't exist or is just a prefix."},
    {text: "Real-world applications of tries:</br>tocomplete systems: </br>- As you type in a search bar or messaging app, tries help suggest words by matching prefixes quickly. </br>- Spell checkers: Word processors use tries to check if a word exists; if not, they suggest the closest matching word.</br>- IP routing (with binary tries): Used in networking for quick lookup of routing prefixes."},
    {text: "You can read more about this data structure through the following links:</br>Read more "},
    {text: "here", link: "https://www.codecademy.com/article/trie-data-structure-complete-guide-to-prefix-trees"},
    {text: " or "},
    {text: "here", link: "https://medium.com/@maxi.gkd/building-a-search-engine-using-a-trie-data-structure-cb79475d8a3d"},
  ],
  pseudocodes: {
      OnAuthorRandomized: {
        title: 'Initialize search and reset to root node',
        code: `currentNode ← self.root</br>index ← 0`,
        tooltip: `We set the currently selected node to the root node and reset the index counter to start searching from the beginning of the target word.`
      },
      OnShelfSelected: {
        title: "Level 0: Match character at current index",
        code: `currentNode ← currentNode.getChildren()[target[index]]</br>index ← index + 1`,
        tooltip: `Access the first level of the trie. We traverse to the child node matching the current character and advance the index.`
      },
      OnColumnSelected: {
        title: "Level 1: Continue traversal down the trie",
        code: `currentNode ← currentNode.getChildren()[target[index]]</br>index ← index + 1`,
        tooltip: `Access the second level of the trie. We continue traversing deeper for the next character in the target word.`
      },
      OnRowSelected: {
        title: "Level 2+: Traverse remaining character levels",
        code: `currentNode ← currentNode.getChildren()[target[index]]</br>index ← index + 1`,
        tooltip: `Access deeper levels of the trie. We continue matching subsequent characters until we reach the end of the target word.`
      },
      OnBookSelected: {
        title: "Validate character exists before traversal",
        code: `if target[index] in currentNode.getChildren() then</br>  currentNode ← currentNode.getChildren()[target[index]]</br>  index ← index + 1</br>else</br>  return false`,
        tooltip: `Check if the next character exists in the trie before moving forward. If not found, the word doesn't exist and we return false.`
      },
      OnHintChildren: {
        title: "Display available next characters",
        code: `availableChars ← currentNode.getChildren().keys()</br>hint ← availableChars`,
        tooltip: `Show all possible next characters that can be traversed from the current node. Useful for understanding valid continuations.`
      },
      OnAuthorFound: {
        title: 'Validate word end and return success',
        code: `if currentNode.isWordEnd() then</br>  return true</br>else</br>  return false`,
        tooltip: `After traversing all characters, check if the final node is marked as the end of a word. Only then have we successfully found the target.`
      },
    },
    operations: ['OnShelfSelected', 'OnColumnSelected', 'OnRowSelected', 'OnBookSelected', 'OnAuthorFound', 'OnHintChildren', 'OnAuthorRandomized'],
  }
