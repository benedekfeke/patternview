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
      title: "Transition to next sorting phase",
      code: `<span class="keyword">switch</span> (state) {<br/>&nbsp;&nbsp;<span class="keyword">case</span> <span class="string">'idle'</span>: state ← <span class="string">'selectDigit'</span><br/>&nbsp;&nbsp;<span class="keyword">case</span> <span class="string">'selectDigit'</span>: state ← <span class="string">'distribute'</span><br/>&nbsp;&nbsp;<span class="keyword">case</span> <span class="string">'distribute'</span>: state ← <span class="string">'collect'</span><br/>&nbsp;&nbsp;<span class="keyword">case</span> <span class="string">'collect'</span>: state ← <span class="string">'advance'</span><br/>&nbsp;&nbsp;<span class="keyword">case</span> <span class="string">'advance'</span>: state ← isComplete ? <span class="string">'done'</span> : <span class="string">'selectDigit'</span><br/>}`,
      tooltip: `Radix sort transitions through phases: <b>Select digit → Distribute to bins → Collect from bins → Advance to next digit</b>. This cycle repeats until all digits are processed.`,
    },
    OnDigitSelected: {
      title: "Select current digit position (LSD)",
      code: `<span class="comment">// Least Significant Digit first</span><br/>activeDigit ← activeDigit + 1<br/>position ← digits.length - activeDigit`,
      tooltip: `In <b>LSD Radix Sort</b>, we start from the rightmost digit (least significant) and move left. This ensures stable sorting — elements with the same digit maintain their relative order from previous passes.`,
    },
    OnLetterMovedToBin: {
      title: "Distribute items into digit bins",
      code: `<span class="keyword">for each</span> item <span class="keyword">in</span> items {<br/>&nbsp;&nbsp;digit ← item.getDigitAt(activeDigit)<br/>&nbsp;&nbsp;bins[digit].<span class="fn">enqueue</span>(item)<br/>}<br/><span class="fn">emit</span>(<span class="string">'DistributionComplete'</span>)`,
      tooltip: `Each item is placed into a bin (0-9) based on its current digit value. For example, ZIP code <b>12345</b> with activeDigit=0 goes into bin <b>5</b> (rightmost digit).`,
    },
    OnLetterCollected: {
      title: "Collect items from bins in order",
      code: `result ← []<br/><span class="keyword">for</span> binIndex <span class="keyword">from</span> 0 <span class="keyword">to</span> 9 {<br/>&nbsp;&nbsp;<span class="keyword">while</span> (bins[binIndex].notEmpty) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;result.<span class="fn">push</span>(bins[binIndex].<span class="fn">dequeue</span>())<br/>&nbsp;&nbsp;}<br/>}<br/><span class="fn">emit</span>(<span class="string">'CollectionComplete'</span>)`,
      tooltip: `Items are collected by draining bins in order (0→9). Since bins are queues (FIFO), the relative order from previous digit passes is preserved — this is what makes radix sort <b>stable</b>.`,
    },
    OnPassComplete: {
      title: "Advance to next digit position",
      code: `activeDigit ← activeDigit + 1<br/><span class="comment">// Clear bins for next pass</span><br/><span class="keyword">for</span> i <span class="keyword">from</span> 0 <span class="keyword">to</span> 9 {<br/>&nbsp;&nbsp;bins[i] ← <span class="keyword">new</span> Queue()<br/>}`,
      tooltip: `After processing one digit, we move to the next position (one place left). If no more digits remain, the items are fully sorted.`,
    },
    OnRadixSortComplete: {
      title: "Sorting complete",
      code: `<span class="keyword">if</span> (activeDigit &gt;= maxDigits) {<br/>&nbsp;&nbsp;state ← <span class="string">'done'</span><br/>&nbsp;&nbsp;<span class="fn">emit</span>(<span class="string">'SortingComplete'</span>)<br/>}`,
      tooltip: `All digit positions have been processed from right to left. The items are now sorted in ascending lexicographic order.`
    },
    OnLettersInitialized: {
      title: "Initialize items for sorting",
      code: `<span class="keyword">function</span> <span class="fn">initializeLetters</span>(zipCodes) {<br/>&nbsp;&nbsp;<span class="keyword">for each</span> zip <span class="keyword">in</span> zipCodes {<br/>&nbsp;&nbsp;&nbsp;&nbsp;digits ← zip.<span class="fn">split</span>(<span class="string">''</span>)<br/>&nbsp;&nbsp;&nbsp;&nbsp;items.<span class="fn">push</span>({ zip, digits })<br/>&nbsp;&nbsp;}<br/>&nbsp;&nbsp;activeDigit ← 0<br/>}`,
      tooltip: `Prepares the ZIP codes for sorting. Each 5-digit code is split into individual digits for radix processing. The algorithm will process from the rightmost digit first.`,
    }
  },
  operations: ['OnDigitSelected', 'OnLetterMovedToBin', 'OnLetterCollected', 'OnPassComplete', 'OnRadixSortComplete', 'OnLettersInitialized'],
  explanationRules: {
    empty: "The objective is to find the goal node",
    hasItems: "TODO",
    default: "TODO"
  }
}
