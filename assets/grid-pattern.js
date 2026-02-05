/**
 * GridPattern - Creates an SVG grid pattern background
 * Vanilla JS port of shadcn/ui GridPattern component
 */

function getGridPatternColors() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  if (theme === 'dark') {
    return {
      fillColor: 'rgb(209 213 219 / 0.15)',
      strokeColor: 'rgb(209 213 219 / 0.15)'
    };
  } else {
    return {
      fillColor: 'rgb(51 65 85 / 0.4)',
      strokeColor: 'rgb(51 65 85 / 0.4)'
    };
  }
}

function createGridPattern(options = {}) {
  const {
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = "0",
    squares = null,
    className = "",
    fillColor = null,
    strokeColor = null
  } = options;

  const colors = getGridPatternColors();
  const finalFillColor = fillColor || colors.fillColor;
  const finalStrokeColor = strokeColor || colors.strokeColor;

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const id = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;

  // Set SVG attributes
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", `pointer-events-none ${className}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("style", `position: fixed; top: 0; left: 0; z-index: -1; fill: ${finalFillColor}; stroke: ${finalStrokeColor};`);

  // Create pattern definition
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
  
  pattern.setAttribute("id", id);
  pattern.setAttribute("width", width);
  pattern.setAttribute("height", height);
  pattern.setAttribute("x", x);
  pattern.setAttribute("y", y);
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M.5 ${height}V.5H${width}`);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-dasharray", strokeDasharray);

  pattern.appendChild(path);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  // Create main grid rectangle
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  rect.setAttribute("fill", `url(#${id})`);
  rect.setAttribute("stroke-width", "0");
  svg.appendChild(rect);

  // Add highlighted squares if provided
  if (squares && Array.isArray(squares)) {
    const squaresSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    squaresSvg.setAttribute("aria-label", "Grid squares");
    squaresSvg.setAttribute("role", "img");
    squaresSvg.setAttribute("class", "overflow-visible");
    squaresSvg.setAttribute("x", x);
    squaresSvg.setAttribute("y", y);
    squaresSvg.setAttribute("width", "100%");
    squaresSvg.setAttribute("height", "100%");
    squaresSvg.setAttribute("style", `pointer-events: none;`);

    squares.forEach(([squareX, squareY], index) => {
      const squareRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      squareRect.setAttribute("width", width - 1);
      squareRect.setAttribute("height", height - 1);
      squareRect.setAttribute("x", squareX * width + 1);
      squareRect.setAttribute("y", squareY * height + 1);
      squareRect.setAttribute("stroke-width", "0");
      squaresSvg.appendChild(squareRect);
    });

    svg.appendChild(squaresSvg);
  }

  return svg;
}

/**
 * Inject grid pattern into a container
 * @param {HTMLElement} container - The element to inject the grid into
 * @param {Object} options - Grid pattern options
 */
function injectGridPattern(container, options = {}) {
  if (!container) return null;
  const gridSvg = createGridPattern(options);
  container.style.position = "relative";
  container.insertAdjacentElement("afterbegin", gridSvg);

  // Listen for theme changes and update grid colors
  const updateGridOnThemeChange = () => {
    const colors = getGridPatternColors();
    const finalFillColor = options.fillColor || colors.fillColor;
    const finalStrokeColor = options.strokeColor || colors.strokeColor;
    gridSvg.setAttribute("style", `position: fixed; top: 0; left: 0; z-index: -1; fill: ${finalFillColor}; stroke: ${finalStrokeColor};`);
  };

  // Watch for data-theme changes
  const observer = new MutationObserver(() => {
    updateGridOnThemeChange();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  return gridSvg;
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { createGridPattern, injectGridPattern };
}
