// Initialize elements
const markdownTextarea = document.getElementById('markdown');
const previewDiv = document.getElementById('preview');
const htmlTextarea = document.getElementById('html');
const convertDirectionSelect = document.getElementById('convertDirection');
const showCodeBtn = document.getElementById('showCode');
const showPreviewBtn = document.getElementById('showPreview');
const downloadHtmlBtn = document.querySelector('button.bg-gradient-to-r.from-blue-300');
const downloadMdBtn = document.querySelector('button.bg-gradient-to-r.from-teal-300');
const clearBtn = document.getElementById('clearBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');

// Initialize Turndown
const turndownService = new TurndownService({
  headingStyle: 'atx',       // Uses # for headings (not underlined)
  bulletListMarker: '-',     // Uses * for lists
  codeBlockStyle: 'fenced',  // Uses ``` for code blocks
  emDelimiter: '*',          // Uses * for emphasis
  strongDelimiter: '**',     // Uses ** for strong
  linkStyle: 'inlined',      // Uses [text](url) format
  hr: '---'              
});

// Toggle between Code and Preview
showCodeBtn.addEventListener('click', () => {
  markdownTextarea.classList.remove('hidden');
  previewDiv.classList.add('hidden');
});

showPreviewBtn.addEventListener('click', () => {
  convertContent(); // Ensure preview is updated
  markdownTextarea.classList.add('hidden');
  previewDiv.classList.remove('hidden');
});

// Live conversion
markdownTextarea.addEventListener('input', convertContent);
convertDirectionSelect.addEventListener('change', convertContent);

// Conversion logic
function convertContent() {
  const inputContent = markdownTextarea.value;
  const selectedDirection = convertDirectionSelect.value;

  if (selectedDirection === 'md-to-html') {
    const html = marked.parse(inputContent);
    htmlTextarea.value = html;
    previewDiv.innerHTML = html;
  } else if (selectedDirection === 'html-to-md') {
    const markdown = htmlToMarkdown(inputContent);
    htmlTextarea.value = markdown;
    previewDiv.innerText = markdown;
  }
}

// HTML to Markdown using Turndown
function htmlToMarkdown(html) {
  let markdown = turndownService.turndown(html);
  return markdown;
}

// Download HTML file logic
downloadHtmlBtn.addEventListener('click', () => {
  const htmlContent = htmlTextarea.value;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'html-file.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Download Markdown file logic
downloadMdBtn.addEventListener('click', () => {
  const markdownContent = markdownTextarea.value;
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-file.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Clear input fields
clearBtn.addEventListener('click', () => {
  markdownTextarea.value = '';
  htmlTextarea.value = '';
  previewDiv.innerHTML = '';
  convertDirectionSelect.value = 'md-to-html';
  markdownTextarea.classList.remove('hidden');
  previewDiv.classList.add('hidden');
});

// Copy Output to Clipboard
copyOutputBtn.addEventListener('click', () => {
  const htmlContent = htmlTextarea.value;
  // Use the Clipboard API to copy content to clipboard
  navigator.clipboard.writeText(htmlContent).then(() => {
    // Change button text to "Copied!"
    copyOutputBtn.textContent = 'Copied!';
    // Revert back to "Copy" after 2 seconds
    setTimeout(() => {
      copyOutputBtn.textContent = 'Copy Code';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
});
