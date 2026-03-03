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
        title: 'Reset search to root node',
        code: `currentNode ← trie.root<br/>index ← 0<br/>target ← <span class="fn">getRandomAuthor</span>()`,
        tooltip: `Initializes a new search by resetting to the root node and selecting a random target author name. The search will proceed character by character from index 0.`
      },
      OnShelfSelected: {
        title: "Traverse to first character (depth 1)",
        code: `<span class="comment">// Match character at index 0</span><br/>char ← target[index]<br/>currentNode ← currentNode.children[char]<br/>index ← index + 1`,
        tooltip: `<b>First level traversal.</b> From the root, we follow the edge labeled with the first character of our target word. Each shelf represents a possible first letter.`
      },
      OnColumnSelected: {
        title: "Traverse to second character (depth 2)",
        code: `<span class="comment">// Match character at index 1</span><br/>char ← target[index]<br/>currentNode ← currentNode.children[char]<br/>index ← index + 1`,
        tooltip: `<b>Second level traversal.</b> We continue down the trie by matching the second character. Only children of the previous node are considered.`
      },
      OnRowSelected: {
        title: "Traverse deeper levels (depth 3+)",
        code: `<span class="comment">// Match character at current index</span><br/>char ← target[index]<br/>currentNode ← currentNode.children[char]<br/>index ← index + 1`,
        tooltip: `<b>Deeper traversal.</b> The trie search continues matching subsequent characters. Each level narrows down the possible words that share the current prefix.`
      },
      OnBookSelected: {
        title: "Validate and traverse to character",
        code: `char ← target[index]<br/><span class="keyword">if</span> (char <span class="keyword">in</span> currentNode.children) {<br/>&nbsp;&nbsp;currentNode ← currentNode.children[char]<br/>&nbsp;&nbsp;index ← index + 1<br/>} <span class="keyword">else</span> {<br/>&nbsp;&nbsp;<span class="keyword">return</span> <span class="keyword">false</span> <span class="comment">// Word not found</span><br/>}`,
        tooltip: `Before traversing, we verify the character exists as a child. If the character is missing from the trie at this position, the target word doesn't exist in our dictionary.`
      },
      OnHintChildren: {
        title: "Display available child characters",
        code: `availableChars ← currentNode.children.<span class="fn">keys</span>()<br/><span class="fn">displayHint</span>(availableChars)`,
        tooltip: `Shows all valid next characters from the current position. Useful for autocomplete — these are all possible continuations of the current prefix.`
      },
      OnAuthorFound: {
        title: 'Verify word exists in trie',
        code: `<span class="keyword">if</span> (currentNode.isEndOfWord) {<br/>&nbsp;&nbsp;<span class="fn">emit</span>(<span class="string">'WordFound'</span>)<br/>&nbsp;&nbsp;<span class="keyword">return</span> <span class="keyword">true</span><br/>} <span class="keyword">else</span> {<br/>&nbsp;&nbsp;<span class="keyword">return</span> <span class="keyword">false</span> <span class="comment">// Only a prefix</span><br/>}`,
        tooltip: `After traversing all characters, we check the <b>isEndOfWord</b> flag. A path existing isn't enough — the word must be explicitly marked as complete. Otherwise, we only found a prefix of another word.`
      },
    },
    operations: ['OnShelfSelected', 'OnColumnSelected', 'OnRowSelected', 'OnBookSelected', 'OnAuthorFound', 'OnHintChildren', 'OnAuthorRandomized'],
  }
