(async function () {
  const content = document.getElementById('content');
  const nav = document.getElementById('site-nav');
  let family = null;

  async function loadFamily() {
    const res = await fetch('family.json');
    family = await res.json();
    buildNav();
  }

  function buildNav() {
    const items = family.members
      .filter(m => m.showInNav)
      .sort((a, b) => a.navOrder - b.navOrder);

    nav.replaceChildren();
    for (const m of items) {
      const a = document.createElement('a');
      a.href = `#/${m.slug}`;
      a.className = 'nav-link';
      a.textContent = m.shortLabel;
      nav.appendChild(a);
    }
  }

  function getSlug() {
    const hash = location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  }

  function setContentFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    content.replaceChildren(...doc.body.childNodes);
  }

  async function loadPage(slug) {
    content.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 150));

    try {
      const res = await fetch(`pages/${slug}.html`);
      if (!res.ok) throw new Error('Not found');
      const html = await res.text();
      setContentFromHTML(html);

      if (slug === 'home' && family) {
        renderMemberGrid();
      }
    } catch {
      content.replaceChildren();
      const div = document.createElement('div');
      div.className = 'not-found';
      const h2 = document.createElement('h2');
      h2.textContent = 'Page not found';
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = '#/';
      a.textContent = 'Return home';
      p.appendChild(a);
      div.appendChild(h2);
      div.appendChild(p);
      content.appendChild(div);
    }

    content.classList.remove('fade-out');
    window.scrollTo(0, 0);
    updateActiveNav(slug);
  }

  function updateActiveNav(slug) {
    nav.querySelectorAll('.nav-link').forEach(link => {
      const linkSlug = link.getAttribute('href').replace('#/', '');
      link.classList.toggle('active', linkSlug === slug);
    });
  }

  function renderMemberGrid() {
    const grid = document.getElementById('member-grid');
    if (!grid) return;

    grid.replaceChildren();
    for (const m of family.members) {
      const years = m.died ? `${m.born} \u2013 ${m.died}` : `b. ${m.born}`;

      const a = document.createElement('a');
      a.href = `#/${m.slug}`;
      a.className = 'member-card';
      a.dataset.type = m.type;

      const h3 = document.createElement('h3');
      h3.className = 'member-name';
      h3.textContent = m.name;

      const yearsSpan = document.createElement('span');
      yearsSpan.className = 'member-years';
      yearsSpan.textContent = years;

      const taglineSpan = document.createElement('span');
      taglineSpan.className = 'member-tagline';
      taglineSpan.textContent = m.tagline;

      a.appendChild(h3);
      a.appendChild(yearsSpan);
      a.appendChild(taglineSpan);
      grid.appendChild(a);
    }
  }

  function onRoute() {
    loadPage(getSlug());
  }

  await loadFamily();
  window.addEventListener('hashchange', onRoute);
  onRoute();
})();
