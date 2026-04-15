(async function () {
  var root = window.SITE_ROOT || '.';
  var nav = document.getElementById('site-nav');

  var res = await fetch(root + '/family.json');
  var family = await res.json();

  // Build nav
  var items = family.members
    .filter(function (m) { return m.showInNav; })
    .sort(function (a, b) { return a.navOrder - b.navOrder; });

  for (var i = 0; i < items.length; i++) {
    var m = items[i];
    var a = document.createElement('a');
    a.href = root + '/legacy/' + m.slug + '/';
    a.className = 'nav-link';
    a.textContent = m.shortLabel;

    if (location.pathname.indexOf('/legacy/' + m.slug) !== -1) {
      a.classList.add('active');
    }

    nav.appendChild(a);
  }

  // Build member grid on home page
  var grid = document.getElementById('member-grid');
  if (grid) {
    for (var j = 0; j < family.members.length; j++) {
      var member = family.members[j];
      var years = member.died
        ? member.born + ' \u2013 ' + member.died
        : 'b. ' + member.born;

      var card = document.createElement('a');
      card.href = root + '/legacy/' + member.slug + '/';
      card.className = 'member-card';
      card.dataset.type = member.type;

      var h3 = document.createElement('h3');
      h3.className = 'member-name';
      h3.textContent = member.name;

      var yearsSpan = document.createElement('span');
      yearsSpan.className = 'member-years';
      yearsSpan.textContent = years;

      var taglineSpan = document.createElement('span');
      taglineSpan.className = 'member-tagline';
      taglineSpan.textContent = member.tagline;

      card.appendChild(h3);
      card.appendChild(yearsSpan);
      card.appendChild(taglineSpan);
      grid.appendChild(card);
    }
  }
})();
