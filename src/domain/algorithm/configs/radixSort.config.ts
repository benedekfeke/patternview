import { AlgorithmConfig } from '../algorithm.types';

// TODO: figure out how to edit this page from /dashboard/page
export const radixSortConfig: AlgorithmConfig = {
  sceneName: 'RadixSort',
  title: 'Sorting Algorithm',
  description: `<a href='https://en.wikipedia.org/wiki/Pathfinding' class="link-hover">Radix Sort</a> is considered one of the fastests sorting algorithms. It avoids comparison by creating and <a href='https://en.wikipedia.org/wiki/Distribution_sort' class="link-hover">distributing</a> elements into buckets (or bins) according to their <a href='https://en.wikipedia.org/wiki/Radix' class="link-hover">radix</a>. This bucketing proces is repeated for each digit, while preserving the ordering of the prior step, until all digits have been considered. Radix sort can be applied to data that can be sorted <a href='https://en.wikipedia.org/wiki/Lexicographical_order' class="link-hover">lexicographically</a>.`,
  modalDescription: [
    {text: 'Radix sort can be implemented to start at either the '},
    { text: 'most significant digit (MSD)' , link: 'https://en.wikipedia.org/wiki/Most_significant_digit' },{text:' or'},
    { text: ' least significant digit(LSD) ', link: 'https://en.wikipedia.org/wiki/Least_significant_digit' }, {text:' - more stable. '},
    {text: "The working principle", link: "https://en.oi-wiki.org/basic/radix-sort/"},{text:" is that the algorithm splits the elements to be sorted into  keywords (when comparing two elements, first compare the first keyword, if they are the same, then compare the second keyword...), and then stably sort the  th keywords, the k-1 -th keywords, and then sort the k-2 -th keywords... Finally, sort the first keywords stably, and the stable sorting of the entire sequence is completed."}, {text: ' Generally, radix sorting is faster than sorting comparison-based algorithm (e.g. '},{text:'quicksort',link:'https://en.oi-wiki.org/basic/quick-sort/'}, {text:"). However, because of the need of extra memory, when the memory space is low, in-place algorithm (e.g. quicksort) may be a better choice."},
    {text: '<br/><br/>General pseudocode: <br/><ol><li>1. Input. An array <i>A</i> consisting of <i>n</i> elements, where each element has <i>k</i> keys.</li><li>2. Output. Array <i>A</i> will be sorted in nondecreasing order stably.</li><li>3. Method.</li><li>4. for <i>i ← k</i> down to 1 <br/><pre>  sort <i>A</i> into nondecreasing order by the <i>i</i>-th key stably.</pre></ol>'}
  ],
  pseudocodes: {
    OnRadixStateChanged: {
      title: "State of the algorithm has changed",
      code: ``
    },
    OnDigitSelected: {
      title: "Selected the rightmost digit → Least Significant Digit (LSD)",
      code: ``
    },
    OnLetterMovedToBin: {
      title: "Moving the letters into bins(boards)...",
      code: ``
    },
    OnLetterCollected: {
      title: "Collecting letters from bins(boards)...",
      code: ``
    },
    OnPassComplete: {
      title: "",
      code: ``
    },
    OnRadixSortComplete: {
      title: "Sorting is complete",
      code: ``
    },
    OnLettersInitialized: {
      title: "Initialized letters to sort.",
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
