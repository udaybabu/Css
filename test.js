

const [searchTerm, setSearchTerm] = useState('');
const contentRef = useRef(null);

const handleSearch = () => {
    if (!searchTerm) return;

    const content = contentRef.current;
    let found = false;

    // Function to find and scroll to the first occurrence
    const findAndScroll = (node) => {
      if (found) return; // If found, stop further searching

      if (node.nodeType === 3) { // Text node
        const regex = new RegExp(searchTerm, 'i');
        const match = node.nodeValue.match(regex);
        if (match) {
          const range = document.createRange();
          const startOffset = match.index;
          const endOffset = match.index + searchTerm.length;
          range.setStart(node, startOffset);
          range.setEnd(node, endOffset);
          const rect = range.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + rect.top - window.innerHeight / 2,
            behavior: 'smooth'
          });
          found = true;
        }
      } else if (node.nodeType === 1) { // Element node
        // Check if the element itself matches the search term
        if (['IMG', 'A'].includes(node.nodeName)) {
          const regex = new RegExp(searchTerm, 'i');
          if (node.nodeName === 'IMG' && regex.test(node.alt)) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            found = true;
            return;
          }
          if (node.nodeName === 'A' && (regex.test(node.href) || regex.test(node.textContent))) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            found = true;
            return;
          }
        }

        // Traverse child nodes
        if (node.childNodes && !['SCRIPT', 'STYLE'].includes(node.nodeName)) {
          for (let i = 0; i < node.childNodes.length; i++) {
            findAndScroll(node.childNodes[i]);
          }
        }
      }
    };

    // Start searching and scrolling
    findAndScroll(content);
  };


<div className='search_container'>
    <input className='global_search'
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
    />
    <button onClick={handleSearch}>Search</button>
</div>


