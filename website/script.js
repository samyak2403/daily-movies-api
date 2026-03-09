// ==============================
// Movies Hub – Main Script
// ==============================

const API_URL = 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/movies.json';

let allMovies = [];
let currentFilter = 'all';

// ── Format duration (seconds → h:mm:ss) ──
function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Format view count ──
function formatViews(count) {
  if (!count) return '0 views';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

// ── Create movie card HTML ──
function createMovieCard(movie) {
  const card = document.createElement('a');
  card.className = 'movie-card';
  card.href = `player.html?v=${movie.id}`;
  // Opens in same tab to use our built-in player
  card.dataset.category = (movie.category || '').toLowerCase();

  const thumbnailUrl = movie.thumbnail || `https://i.ytimg.com/vi/${movie.id}/hqdefault.jpg`;

  card.innerHTML = `
    <div class="card-thumbnail">
      <img src="${thumbnailUrl}" alt="${escapeHtml(movie.title)}" loading="lazy" />
      <span class="card-duration">${formatDuration(movie.duration)}</span>
      <span class="card-category-badge">${escapeHtml(movie.category || 'Unknown')}</span>
      <div class="play-overlay">
        <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(movie.title)}</h3>
      <div class="card-meta">
        <span class="card-views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          ${formatViews(movie.view_count)}
        </span>
        <span class="card-uploader" title="${escapeHtml(movie.uploader || '')}">${escapeHtml(movie.uploader || 'Unknown')}</span>
      </div>
    </div>
  `;

  return card;
}

// ── Escape HTML to prevent XSS ──
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Show loading skeletons ──
function showSkeletons(container, count = 12) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-thumb"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
    container.appendChild(skeleton);
  }
}

// ── Render movies ──
function renderMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = '';

  if (movies.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <h3>No movies found</h3>
        <p>Try selecting a different category</p>
      </div>
    `;
    return;
  }

  movies.forEach(movie => {
    grid.appendChild(createMovieCard(movie));
  });
}

// ── Filter movies ──
function filterMovies(category) {
  currentFilter = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  applyFilters();
}

// ── Search & Filter Logic ──
let searchQuery = '';

function applyFilters() {
  let filtered = allMovies;

  // 1. Apply category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(m => (m.category || '').toLowerCase() === currentFilter);
  }

  // 2. Apply search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(m =>
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.uploader && m.uploader.toLowerCase().includes(query)) ||
      (m.category && m.category.toLowerCase().includes(query))
    );
  }

  // Update result count display if searching
  const countEl = document.getElementById('searchResultCount');
  if (countEl) {
    if (searchQuery.trim() !== '') {
      countEl.textContent = `Found ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    } else {
      countEl.textContent = '';
    }
  }

  renderMovies(filtered);
}

// ── Search Events ──
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;

    // Toggle clear button
    if (searchClear) {
      if (searchQuery.trim() !== '') {
        searchClear.classList.add('visible');
      } else {
        searchClear.classList.remove('visible');
      }
    }

    applyFilters();
  });
}

function clearSearch() {
  if (searchInput) {
    searchInput.value = '';
    searchQuery = '';
    if (searchClear) searchClear.classList.remove('visible');
    applyFilters();
    searchInput.focus();
  }
}

// ── Update stats ──
function updateStats(movies) {
  const totalEl = document.getElementById('totalMovies');
  const categoriesEl = document.getElementById('totalCategories');
  const viewsEl = document.getElementById('totalViews');

  if (totalEl) totalEl.textContent = movies.length;

  if (categoriesEl) {
    const uniqueCategories = new Set(movies.map(m => m.category));
    categoriesEl.textContent = uniqueCategories.size;
  }

  if (viewsEl) {
    const total = movies.reduce((sum, m) => sum + (m.view_count || 0), 0);
    if (total >= 1_000_000_000) {
      viewsEl.textContent = (total / 1_000_000_000).toFixed(1) + 'B';
    } else if (total >= 1_000_000) {
      viewsEl.textContent = (total / 1_000_000).toFixed(0) + 'M';
    } else {
      viewsEl.textContent = (total / 1_000).toFixed(0) + 'K';
    }
  }
}

// ── Initialize ──
async function init() {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;

  showSkeletons(grid);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch movies');

    const data = await response.json();
    allMovies = data.movies || [];

    updateStats(allMovies);
    renderMovies(allMovies);

    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterMovies(btn.dataset.category);
      });
    });

  } catch (error) {
    console.error('Error loading movies:', error);
    grid.innerHTML = `
      <div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3>Could not load movies</h3>
        <p>Please check your internet connection and try again</p>
      </div>
    `;
  }
}

// ── Copy code block to clipboard (for docs page) ──
function copyCode(button) {
  const codeBlock = button.closest('.code-block').querySelector('pre');
  const text = codeBlock.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => { button.textContent = original; }, 2000);
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
