/** @param {Element} block The hero block element */
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];

  // Text-flow elements (headings, paragraphs) that aren't just picture wrappers.
  const textNodes = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
    .filter((el) => !el.querySelector('picture'));

  // Rebuild the block into distinct layers regardless of how the author
  // structured the content (image + text in one cell, or split across cells):
  // one or more image rows, followed by a text overlay row.
  block.textContent = '';

  if (pictures.length === 0) {
    block.classList.add('no-image');
  } else if (pictures.length === 1) {
    const imgDiv = document.createElement('div');
    imgDiv.append(pictures[0]);
    block.append(imgDiv);
  } else {
    // Dual-image hero: first = light, second = dark.
    const lightDiv = document.createElement('div');
    lightDiv.classList.add('hero-img-light');
    lightDiv.append(pictures[0]);

    const darkDiv = document.createElement('div');
    darkDiv.classList.add('hero-img-dark');
    darkDiv.append(pictures[1]);

    // In dark mode, place the dark image first so waitForFirstImage
    // eager-loads the visible (LCP) image rather than the hidden one.
    const isDark = document.body.classList.contains('dark-scheme');
    if (isDark) block.append(darkDiv, lightDiv);
    else block.append(lightDiv, darkDiv);
  }

  // Text overlay row.
  const textOuter = document.createElement('div');
  textOuter.classList.add('hero-text');
  const textInner = document.createElement('div');
  textInner.append(...textNodes);
  textOuter.append(textInner);
  block.append(textOuter);

  // Mark the first <p> that appears before the <h1> as a tagline.
  const h1 = textInner.querySelector('h1');
  if (!h1) return;

  const children = [...textInner.children];
  const h1Index = children.indexOf(h1);
  for (let i = 0; i < h1Index; i += 1) {
    if (children[i].tagName === 'P' && !children[i].classList.contains('button-container')) {
      children[i].classList.add('hero-tagline');
      break;
    }
  }
}
