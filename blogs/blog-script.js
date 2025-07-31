document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
  });

  // Reading Progress Bar
  function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #7a7cff, #00d4ff);
      z-index: 9999;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }
  createProgressBar();

  // Copy Code Button for all code blocks
  function addCopyButtons() {
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      const pre = codeBlock.parentNode;
      const button = document.createElement('button');
      button.textContent = '📋 Copy';
      button.className = 'copy-btn';
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
      `;

      pre.style.position = 'relative';

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          button.textContent = '✅ Copied!';
          button.style.background = 'rgba(34, 197, 94, 0.2)';
          setTimeout(() => {
            button.textContent = '📋 Copy';
            button.style.background = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        } catch (err) {
          button.textContent = '❌ Failed';
          setTimeout(() => {
            button.textContent = '📋 Copy';
          }, 2000);
        }
      });

      pre.appendChild(button);
    });
  }

  // Estimated Reading Time
  function addReadingTime() {
    const content = document.querySelector('.blog-content');
    const text = content.textContent;
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const readingTimeElement = document.createElement('p');
    readingTimeElement.className = 'reading-time';
    readingTimeElement.innerHTML = `📖 ${readingTime} min read • ${wordCount.toLocaleString()} words`;
    readingTimeElement.style.cssText = `
      color: #888;
      font-size: 0.9em;
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;

    const blogMeta = document.querySelector('.blog-meta');
    blogMeta.parentNode.insertBefore(readingTimeElement, blogMeta.nextSibling);
  }

  // Function to process markdown in text content (enhanced)
  function processMarkdown(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      let text = textNode.textContent;
      let hasMarkdown = false;

      // Enhanced markdown patterns
      if (text.includes('**') || text.includes('`') || text.includes('*') || text.includes('~~')) {
        hasMarkdown = true;

        // Convert markdown to HTML with more patterns
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>'); // Strikethrough
      }

      if (hasMarkdown) {
        const temp = document.createElement('span');
        temp.innerHTML = text;

        const parent = textNode.parentNode;
        while (temp.firstChild) {
          parent.insertBefore(temp.firstChild, textNode);
        }
        parent.removeChild(textNode);
      }
    });
  }

  // Back to Top Button
  function addBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7a7cff, #00d4ff);
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(122, 124, 255, 0.3);
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Table of Contents Generator
  function generateTOC() {
    const headings = document.querySelectorAll('h2, h3, h4');
    if (headings.length < 3) return; // Only create TOC if there are enough headings

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>📚 Table of Contents</h3>';

    const tocList = document.createElement('ul');
    tocList.style.cssText = `
      list-style: none;
      padding-left: 0;
      margin: 1rem 0;
    `;

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.style.cssText = `
        color: #7a7cff;
        text-decoration: none;
        padding: 0.25rem 0;
        display: block;
        border-left: 2px solid transparent;
        padding-left: ${heading.tagName === 'H2' ? '0' : heading.tagName === 'H3' ? '1rem' : '2rem'};
        transition: all 0.2s ease;
      `;

      link.addEventListener('mouseenter', () => {
        link.style.borderLeftColor = '#7a7cff';
        link.style.paddingLeft = `calc(${link.style.paddingLeft} + 0.5rem)`;
      });

      link.addEventListener('mouseleave', () => {
        link.style.borderLeftColor = 'transparent';
        link.style.paddingLeft = `${heading.tagName === 'H2' ? '0' : heading.tagName === 'H3' ? '1rem' : '2rem'}`;
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    toc.appendChild(tocList);
    toc.style.cssText = `
      background: rgba(122, 124, 255, 0.1);
      border: 1px solid rgba(122, 124, 255, 0.2);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 2rem 0;
      backdrop-filter: blur(10px);
    `;

    // Insert TOC after the intro paragraph
    const intro = document.querySelector('.blog-intro');
    intro.parentNode.insertBefore(toc, intro.nextSibling.nextSibling);
  }

  // Initialize all features
  setTimeout(() => {
    addReadingTime();
    addCopyButtons();
    addBackToTop();
    generateTOC();

    // Process markdown in all relevant elements
    const paragraphs = document.querySelectorAll('p, summary, li');
    paragraphs.forEach(processMarkdown);

    // Re-run Prism highlighting after markdown conversion
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }

    // Re-render MathJax if available
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }, 100);

  // Add smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
