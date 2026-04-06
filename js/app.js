// =============================================
// CLIMAX ONLINE — FRONTEND APP
// No API keys here! All secrets on server.
// =============================================

const API = '/.netlify/functions/posts';
const SITE_URL = window.location.origin;

let allPosts = [];
let currentFilter = 'all';

// ---- LOAD POSTS ----
async function loadPosts() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    allPosts = (data.posts || []).sort((a, b) => b.createdAt - a.createdAt);
    updateStats();
    renderPosts(allPosts);
    updateTicker(allPosts);
  } catch (e) {
    document.getElementById('postsGrid').innerHTML = `
      <div class="error-state">
        <p>⚠️ Posts load nahi hue. Netlify functions check karo.</p>
      </div>`;
  }
}

function updateStats() {
  document.getElementById('statTotal').textContent = allPosts.length;
  document.getElementById('statJobs').textContent = allPosts.filter(p => p.category === 'job').length;
  document.getElementById('statResults').textContent = allPosts.filter(p => p.category === 'result').length;
}

function updateTicker(posts) {
  const t = document.getElementById('tickerInner');
  if (!posts.length) { t.textContent = 'Abhi koi update nahi. Jald aayega!'; return; }
  t.textContent = posts.slice(0, 8).map(p => `🔔 ${p.title}`).join('  ·····  ');
}

function getCategoryBadge(cat) {
  return {
    job:     { icon: '💼', label: 'Latest Job' },
    result:  { icon: '📊', label: 'Result' },
    admit:   { icon: '🪪', label: 'Admit Card' },
    answer:  { icon: '🗝️', label: 'Answer Key' },
    syllabus:{ icon: '📚', label: 'Syllabus' },
    news:    { icon: '📰', label: 'News' }
  }[cat] || { icon: '📋', label: 'Update' };
}

function renderPosts(posts) {
  const grid = document.getElementById('postsGrid');
  const noRes = document.getElementById('noResults');
  document.getElementById('postCount').textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;

  if (!posts.length) { grid.innerHTML = ''; noRes.style.display = 'flex'; return; }
  noRes.style.display = 'none';

  grid.innerHTML = posts.map((post, i) => {
    const badge = getCategoryBadge(post.category);
    const date = post.createdAt
      ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Recently';
    const shortDesc = post.description
      ? post.description.substring(0, 130) + (post.description.length > 130 ? '...' : '')
      : '';
    const img = post.imageUrl
      ? `<div class="card-img"><img src="${post.imageUrl}" alt="${post.title}" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>`
      : `<div class="card-img-placeholder">${badge.icon}</div>`;

    return `
      <article class="post-card" style="animation-delay:${i * 0.06}s" onclick="openPost('${post.id}')">
        ${img}
        <div class="card-body">
          <span class="badge badge-${post.category}">${badge.icon} ${badge.label}</span>
          <h3 class="card-title">${post.title}</h3>
          <p class="card-desc">${shortDesc}</p>
          <div class="card-meta">
            <span class="card-date">📅 ${date}</span>
            ${post.lastDate ? `<span class="card-deadline">⏰ Last: ${post.lastDate}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn-read" onclick="event.stopPropagation();openPost('${post.id}')">Read More</button>
            <button class="btn-wa" onclick="event.stopPropagation();shareWhatsApp('${post.id}')">📲 Share</button>
          </div>
        </div>
      </article>`;
  }).join('');
}

window.openPost = function(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;
  const badge = getCategoryBadge(post.category);
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const img = post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="modal-img"/>` : '';

  // Build Important Dates table
  let datesTable = '';
  if (post.importantDates && post.importantDates.length) {
    datesTable = `
      <div class="post-section">
        <div class="post-section-title">📅 Important Dates</div>
        <table class="post-table">
          <tbody>${post.importantDates.map(r=>`<tr><td>${r[0]||''}</td><td class="date-val">${r[1]||''}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  // Build Application Fee table
  let feeTable = '';
  if (post.applicationFee && post.applicationFee.length) {
    feeTable = `
      <div class="post-section">
        <div class="post-section-title">💰 Application Fee</div>
        <table class="post-table">
          <tbody>${post.applicationFee.map(r=>`<tr><td>${r[0]||''}</td><td class="fee-val">${r[1]||''}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  // Build Vacancy info
  let vacancyBox = '';
  if (post.totalPosts || post.postName || post.salary || post.ageLimit || post.qualification || post.examMode) {
    const rows = [
      post.totalPosts    ? ['Total Vacancies', post.totalPosts]    : null,
      post.postName      ? ['Post Name', post.postName]            : null,
      post.salary        ? ['Pay Scale / Salary', post.salary]     : null,
      post.ageLimit      ? ['Age Limit', post.ageLimit]            : null,
      post.qualification ? ['Qualification', post.qualification]   : null,
      post.examMode      ? ['Exam Mode', post.examMode]            : null,
    ].filter(Boolean);
    vacancyBox = `
      <div class="post-section">
        <div class="post-section-title">📋 Vacancy Details</div>
        <table class="post-table">
          <tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td><strong>${r[1]}</strong></td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  // Build Important Links table
  let linksTable = '';
  if (post.importantLinks && post.importantLinks.length) {
    linksTable = `
      <div class="post-section">
        <div class="post-section-title">🔗 Important Links</div>
        <table class="post-table links-table">
          <tbody>${post.importantLinks.map(r=>r[1]?`<tr><td>${r[0]||'Link'}</td><td><a href="${r[1]}" target="_blank" class="post-link-btn">Click Here ↗</a></td></tr>`:'').join('')}</tbody>
        </table>
      </div>`;
  }

  // Notes
  const notesBlock = post.notes ? `<div class="post-section"><div class="post-section-title">📝 Additional Details</div><div class="post-notes">${post.notes.replace(/\n/g,'<br>')}</div></div>` : '';

  // Department badge
  const deptBadge = post.department ? `<div class="post-dept">🏛️ ${post.department}</div>` : '';

  document.getElementById('modalContent').innerHTML = `
    <span class="badge badge-${post.category}" style="margin-bottom:8px;display:inline-block">${badge.icon} ${badge.label}</span>
    ${img}
    <h2 class="modal-title">${post.title}</h2>
    ${deptBadge}
    <div class="modal-meta">
      <span>📅 ${date}</span>
      ${post.lastDate ? `<span class="last-date-badge">⏰ Last Date: ${post.lastDate}</span>` : ''}
    </div>
    <p class="post-desc-text">${post.description || ''}</p>
    ${vacancyBox}
    ${datesTable}
    ${feeTable}
    ${notesBlock}
    ${linksTable}
    <button class="share-wa-big" onclick="shareWhatsApp('${post.id}')">📲 Share on WhatsApp</button>`;

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
};

window.shareWhatsApp = function(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;
  const desc = post.description ? post.description.substring(0, 200) : '';
  const lastDate  = post.lastDate   ? `\n⏰ *Last Date:* ${post.lastDate}`     : '';
  const totalPost = post.totalPosts ? `\n📝 *Total Posts:* ${post.totalPosts}` : '';
  const msg = `🔔 *${post.title}*\n\n${desc}${lastDate}${totalPost}\n\n🌐 *More Details:*\n${SITE_URL}\n\n📍 _Climax Online, Rewa — Govt Job Update Source_\n_MP Online Service Center_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
};

window.filterPosts = function(cat) {
  currentFilter = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  const pill = document.getElementById(`pill-${cat}`);
  if (pill) pill.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById(`nav-${cat}`);
  if (nav) nav.classList.add('active');
  const titles = { all: 'Latest Updates', job: 'Latest Jobs', result: 'Results', admit: 'Admit Cards', answer: 'Answer Keys', syllabus: 'Syllabus' };
  document.getElementById('sectionTitle').textContent = titles[cat] || 'Updates';
  renderPosts(cat === 'all' ? allPosts : allPosts.filter(p => p.category === cat));
  document.getElementById('searchInput').value = '';
};

window.searchPosts = function() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { filterPosts(currentFilter); return; }
  renderPosts(allPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  ));
  document.getElementById('sectionTitle').textContent = `Search: "${q}"`;
};

window.toggleMenu = function() {
  document.getElementById('mobileMenu').classList.toggle('open');
};

function updateClock() {
  document.getElementById('live-time').textContent =
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
}
setInterval(updateClock, 1000);
updateClock();
loadPosts();
