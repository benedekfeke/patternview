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
      title: "State of the algorithm has changed (Step forward or back)",
      code: `state ← 'idle' | 'selectDigit' | 'distribute' | 'collect' | 'advance' | 'done'`,
      tooltip: `
        history.Push(model.CreateSnapshot()); 
        switch (model.State) 
          case RadixState.Idle: TransitionTo(RadixState.SelectDigit); break; 
          case RadixState.SelectDigit: ExecuteSelectDigit(); TransitionTo(RadixState.DistributeToBins); break;
          case RadixState.DistributeToBins: ExecuteDistribute(); TransitionTo(RadixState.CollectFromBins); break;
          case RadixState.CollectFromBins: ExecuteCollect(); TransitionTo(RadixState.AdvanceDigit); break;
          case RadixState.AdvanceDigit: ExecuteAdvance(); 
            if (model.IsComplete) TransitionTo(RadixState.Done); events.RaiseSortingComplete(); 
            else TransitionTo(RadixState.SelectDigit); 
            break; 
          case RadixState.Done: break; 
      `,
    },
    OnDigitSelected: {
      title: "Selected the rightmost digit → Least Significant Digit (LSD)",
      code: `ActiveDigit ← ActiveDigit++`,
      tooltip: `Active digit marks the currently aktive digit (or <b>key</b>, see more in description above) in our LSD radix sort`,
    },
    OnLetterMovedToBin: {
      title: "Moving the letters into bins(boards)...",
      code: `bins ← array[0..RADIX-1] of empty queues<br/>for each item in items:<br/>&nbsp;&nbsp;digit ← getActiveDigit(item)<br/>&nbsp;&nbsp;bins[digit].Enqueue(item)<br/>emit DistributionComplete<br/>`,
      tooltip: `We distribute the letters based on the currently active digit. Each letter goes into the bin with a number equal to the active digit.`,
    },
    OnLetterCollected: {
      title: "Collecting letters from bins(boards)...",
      code: `Letters ← empty array&lt;Letter&gt;<br/><br/>for binIndex from 0 to RADIX-1:<br/>&nbsp;&nbsp;while bins[binIndex] is not empty:<br/>&nbsp;&nbsp;&nbsp;&nbsp;letter ← bins[binIndex].Dequeue()<br/>&nbsp;&nbsp;&nbsp;&nbsp;Letters.Add(letter)<br/><br/>emit CollectionComplete<br/>`,
      tooltip: `We collect the letters by draining the bins in order, bins are processed by index, from low to high, preserving order. Each bin is fully emptied and the Letters array is reconstructed.`,
    },
    OnPassComplete: {
      title: "Advancing to the next digit (key)",
      code: `ActiveDigit ← ActiveDigit++<br/>bins ← array[0..RADIX-1] of empty queues`,
      tooltip: `Note that if "next digit" does not exists, we should have our letters already sorted`,
    },
    OnRadixSortComplete: {
      title: "Sorting is complete",
      code: `if (IsSortingComplete)&nbsp;&nbsp;state ← States.done<br/>,&nbsp;&nbsp;emit SortingComplete<br/>else<br/>&nbsp;&nbsp;state ← States.selectDigit`,
      tooltip: `All digits have been processed. The array is now fully sorted in lexicographic order.`
    },
    OnLettersInitialized: {
      title: "Initialized letters to sort.",
      code: `initializeLetters(letter):<br/>&nbsp;&nbsp;store letter as internal data<br/>&nbsp;&nbsp;set zipLabel text to letter.FullZip<br/><br/>
        &nbsp;&nbsp;for i from 0 to 4:<br/>&nbsp;&nbsp;&nbsp;&nbsp;if i &lt; number of digitLabels:<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;set digitLabels[i] text to letter.Digits[i]<br/>`,
      tooltip: `We initialize our letters which we want to sort, while restricting the numbers to 5 digits, since ZIP postal codes have usually 5 digits.`,
    }
  },
  operations: ['OnRadixStateChanged', 'OnDigitSelected', 'OnLetterMovedToBin', 'OnLetterCollected', 'OnPassComplete', 'OnRadixSortComplete', 'OnLetterInitialized'],
  explanationRules: {
    empty: "The objective is to find the goal node",
    hasItems: "TODO",
    default: "TODO"
  }
}
