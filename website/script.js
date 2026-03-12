// ==============================
// Movies Hub – Main Script
// ==============================

const API_URL = 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/movies.json';

// Individual cartoon show API endpoints
const CARTOON_APIS = {
  'cartoons/oggy_and_the_cockroaches': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/oggy_and_the_cockroaches/oggy_and_the_cockroaches.json',
  'cartoons/bandbudh_aur_budbak': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/bandbudh_aur_budbak/bandbudh_aur_budbak.json',
  'cartoons/chhota_bheem': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/chhota_bheem/chhota_bheem.json',
  'cartoons/motu_patlu': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/motu_patlu/motu_patlu.json',
  'cartoons/gattu_battu': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/gattu_battu/gattu_battu.json',
  'cartoons/doraemon': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/doraemon/doraemon.json',
  'cartoons/ninja_hattori': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/ninja_hattori/ninja_hattori.json',
  'cartoons/chacha_bhatija': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/chacha_bhatija/chacha_bhatija.json',
  'cartoons/shinchan': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/shinchan/shinchan.json',
  'cartoons/pokemon': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/pokemon/pokemon.json',
  'cartoons/roll_no_21': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/roll_no_21/roll_no_21.json',
  'cartoons/little_singham': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/little_singham/little_singham.json',
  'cartoons/shiva': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/shiva/shiva.json',
  'cartoons/rudra': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/rudra/rudra.json',
  'cartoons/vir_the_robot_boy': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/vir_the_robot_boy/vir_the_robot_boy.json',
  'cartoons/pakdam_pakdai': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/pakdam_pakdai/pakdam_pakdai.json',
  'cartoons/mighty_raju': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/mighty_raju/mighty_raju.json',
  'cartoons/honey_bunny_ka_jholmaal': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/honey_bunny_ka_jholmaal/honey_bunny_ka_jholmaal.json',
  'cartoons/guru_aur_bhole': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/guru_aur_bhole/guru_aur_bhole.json',
  'cartoons/eena_meena_deeka': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/eena_meena_deeka/eena_meena_deeka.json',
  'cartoons/inspector_chingum': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/inspector_chingum/inspector_chingum.json',
  'cartoons/fukrey_boyzzz': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/fukrey_boyzzz/fukrey_boyzzz.json',
  'cartoons/golmaal_jr': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/golmaal_jr/golmaal_jr.json',
  'cartoons/masha_and_the_bear': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/masha_and_the_bear/masha_and_the_bear.json',
  'cartoons/peppa_pig': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/peppa_pig/peppa_pig.json',
  'cartoons/tom_and_jerry': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/tom_and_jerry/tom_and_jerry.json',
  'cartoons/ben_10': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/ben_10/ben_10.json',
  'cartoons/mr_bean': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/mr_bean/mr_bean.json',
  'cartoons/zig_and_sharko': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/zig_and_sharko/zig_and_sharko.json',
  'cartoons/bapu': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/bapu/bapu.json',
  'cartoons/tik_tak_tail': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/tik_tak_tail/tik_tak_tail.json',
  'cartoons/keymon_ache': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/keymon_ache/keymon_ache.json',
  'cartoons/super_bheem': 'https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/super_bheem/super_bheem.json',
};

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
    // Fetch main movies API
    const mainResponse = await fetch(API_URL);
    if (!mainResponse.ok) throw new Error('Failed to fetch movies');
    const mainData = await mainResponse.json();
    let movies = mainData.movies || [];

    // Fetch all cartoon show APIs in parallel
    const cartoonPromises = Object.entries(CARTOON_APIS).map(async ([category, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        const episodes = data.episodes || data.movies || [];
        // Tag each episode with its cartoon category
        return episodes.map(ep => ({ ...ep, category: category }));
      } catch (e) {
        console.warn(`Could not fetch ${category}:`, e);
        return [];
      }
    });

    const cartoonResults = await Promise.all(cartoonPromises);
    const cartoonMovies = cartoonResults.flat();

    // Merge all movies and deduplicate by ID
    const allMerged = [...movies, ...cartoonMovies];
    const uniqueMap = {};
    allMerged.forEach(m => { if (m.id) uniqueMap[m.id] = m; });
    allMovies = Object.values(uniqueMap);

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
