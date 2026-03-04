import { AlgorithmConfig } from "../algorithm.types";

export const trieConfig: AlgorithmConfig = {
  sceneName: 'Trie',
  title: 'Trie Data Structure',
  instructions: 'Instructions: Find the target name, select the currently highlighted shelf/column/row/book to match the highlighted character on top. Move with WASD, select with "Space".',
  description: `A trie (pronounced “try”) is a tree-based data structure that stores strings efficiently by sharing common prefixes. Also called a prefix tree, a trie enables fast string search, insertion, and deletion operations in O(L) time, where L is the string length.`,
  modalDescription: [
    { text: 'A ' },
    { text: 'trie', link: 'https://en.wikipedia.org/wiki/Trie' },
    { text: ' (from re<b>trie</b>val, pronounced "try") is a ' },
    { text: 'tree-based data structure', link: 'https://en.wikipedia.org/wiki/Tree_(data_structure)' },
    { text: ' designed for efficient string storage and retrieval. Also known as a <b>prefix tree</b> or <b>digital tree</b>, it excels at operations involving prefixes and is widely used in text processing applications.' },
    { text: '<br/><br/><b>Structure of a Trie:</b><br/>' },
    { text: '• The <b>root node</b> is empty and represents the start of all words.<br/>' },
    { text: '• Each <b>edge</b> represents a character.<br/>' },
    { text: '• Each <b>node</b> may have up to 26 children (for lowercase English) or more depending on the alphabet.<br/>' },
    { text: '• A special <b>isEndOfWord</b> flag marks nodes where a complete word ends.<br/>' },
    { text: '• The <b>path</b> from root to any node spells out a prefix shared by multiple words.' },
    { text: '<br/><br/><b>Core Operations:</b><br/>' },
    { text: '• <b>Insert:</b> Add a word by creating nodes for each character — O(L) time<br/>' },
    { text: '• <b>Search:</b> Check if a word exists by traversing its characters — O(L) time<br/>' },
    { text: '• <b>StartsWith:</b> Check if any word begins with a given prefix — O(L) time<br/>' },
    { text: '• <b>Delete:</b> Remove a word (more complex, may need to clean up unused nodes) — O(L) time<br/>' },
    { text: '<br/>Where <i>L</i> is the length of the word. Note: These operations are independent of how many words are stored!' },
    { text: '<br/><br/><b>Why Use a Trie Instead of a Hash Table?</b><br/>' },
    { text: 'While a ' },
    { text: 'hash table', link: 'https://en.wikipedia.org/wiki/Hash_table' },
    { text: ' provides O(1) average lookup, tries offer unique advantages:<br/>' },
    { text: '• <b>Prefix queries:</b> Find all words starting with "pre" instantly<br/>' },
    { text: '• <b>Ordered iteration:</b> Words can be retrieved in alphabetical order<br/>' },
    { text: '• <b>No hash collisions:</b> Performance is consistent and predictable<br/>' },
    { text: '• <b>Shared prefixes:</b> Words like "cat", "car", "card" share nodes, saving memory' },
    { text: '<br/><br/><b>Space Complexity:</b><br/>' },
    { text: 'In the worst case, a trie uses O(ALPHABET_SIZE × L × N) space, where N is the number of words. However, in practice, shared prefixes significantly reduce memory usage. ' },
    { text: 'Compressed tries', link: 'https://en.wikipedia.org/wiki/Radix_tree' },
    { text: ' (also called radix trees) merge single-child chains to save even more space.' },
    { text: '<br/><br/><b>Real-World Applications:</b><br/>' },
    { text: '• <b>Autocomplete:</b> Search engines and text editors suggest completions as you type. The trie quickly finds all words matching your prefix.<br/>' },
    { text: '• <b>Spell Checking:</b> Word processors use tries to verify words exist. If not found, they can suggest similar words by exploring nearby branches.<br/>' },
    { text: '• <b>IP Routing:</b> ' },
    { text: 'Routers', link: 'https://en.wikipedia.org/wiki/Router_(computing)' },
    { text: ' use binary tries to match IP address prefixes and determine packet destinations.<br/>' },
    { text: '• <b>T9 Predictive Text:</b> Old mobile phones used tries to predict words from numeric key presses.<br/>' },
    { text: '• <b>Word Games:</b> Scrabble solvers and Wordle helpers use tries to find valid words efficiently.<br/>' },
    { text: '• <b>Genome Analysis:</b> ' },
    { text: 'Bioinformatics', link: 'https://en.wikipedia.org/wiki/Bioinformatics' },
    { text: ' uses tries to search DNA sequences.' },
    { text: '<br/><br/><b>Trie Variations:</b><br/>' },
    { text: '• ' },
    { text: 'Radix Tree (Patricia Trie)', link: 'https://en.wikipedia.org/wiki/Radix_tree' },
    { text: ' — Compresses chains of single-child nodes<br/>' },
    { text: '• ' },
    { text: 'Suffix Tree', link: 'https://en.wikipedia.org/wiki/Suffix_tree' },
    { text: ' — Stores all suffixes of a string for pattern matching<br/>' },
    { text: '• ' },
    { text: 'Ternary Search Tree', link: 'https://en.wikipedia.org/wiki/Ternary_search_tree' },
    { text: ' — Uses three children per node (less, equal, greater) for better space efficiency' },
    { text: '<br/><br/><b>In This Visualization:</b><br/>' },
    { text: 'You navigate through a trie representing author names. Each "shelf" corresponds to the first letter, each "column" to the second, and so on. By selecting the correct path, you search for a specific author — just like how a computer traverses the trie character by character.' },
    { text: '<br/><br/><b>Further Reading:</b><br/>' },
    { text: '• ' },
    { text: 'Codecademy: Complete Guide to Tries', link: 'https://www.codecademy.com/article/trie-data-structure-complete-guide-to-prefix-trees' },
    { text: '<br/>• ' },
    { text: 'Building a Search Engine Using Tries', link: 'https://medium.com/@maxi.gkd/building-a-search-engine-using-a-trie-data-structure-cb79475d8a3d' }
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
        tooltip: `First level traversal. From the root, we follow the edge labeled with the first character of our target word. Each shelf represents a possible first letter.`
      },
      OnColumnSelected: {
        title: "Traverse to second character (depth 2)",
        code: `<span class="comment">// Match character at index 1</span><br/>char ← target[index]<br/>currentNode ← currentNode.children[char]<br/>index ← index + 1`,
        tooltip: `Second level traversal. We continue down the trie by matching the second character. Only children of the previous node are considered.`
      },
      OnRowSelected: {
        title: "Traverse deeper levels (depth 3+)",
        code: `<span class="comment">// Match character at current index</span><br/>char ← target[index]<br/>currentNode ← currentNode.children[char]<br/>index ← index + 1`,
        tooltip: `Deeper traversal. The trie search continues matching subsequent characters. Each level narrows down the possible words that share the current prefix.`
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
        tooltip: `After traversing all characters, we check the "isEndOfWord" flag. A path existing isn't enough — the word must be explicitly marked as complete. Otherwise, we only found a prefix of another word.`
      },
    },
    operations: ['OnShelfSelected', 'OnColumnSelected', 'OnRowSelected', 'OnBookSelected', 'OnAuthorFound', 'OnHintChildren', 'OnAuthorRandomized'],
  }
