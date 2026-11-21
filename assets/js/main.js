/* Site-wide behaviour: menu, current tab, theme switch, publication and tag filters, list of sections in a post, image viewer. No dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  function all(sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Menu button (narrow screens): show or hide the tabs ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    all('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------- Tabs: on the home page, mark the tab of the section that is on screen ---------- */
  var spy = [];
  if (nav) {
    all('a[href*="#"]', nav).forEach(function (a) {
      var id = a.getAttribute('href').split('#')[1];
      var sec = id ? document.getElementById(id) : null;
      if (sec && sec.tagName === 'SECTION' && a.pathname === location.pathname) spy.push({ link: a, sec: sec });
    });
    spy.sort(function (a, b) { return a.sec.offsetTop - b.sec.offsetTop; });
  }
  if (spy.length) {
    var bar = document.querySelector('.masthead');
    var waiting = false;
    var markTab = function () {
      waiting = false;
      var line = (bar ? bar.offsetHeight : 0) + 40;
      var current = spy[0];
      spy.forEach(function (s) { if (s.sec.getBoundingClientRect().top <= line) current = s; });
      if (window.innerHeight + window.pageYOffset >= root.scrollHeight - 4) current = spy[spy.length - 1];
      spy.forEach(function (s) {
        if (s === current) s.link.setAttribute('aria-current', 'location'); else s.link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', function () {
      if (!waiting) { waiting = true; window.requestAnimationFrame(markTab); }
    }, { passive: true });
    window.addEventListener('resize', markTab);
    window.addEventListener('load', markTab);
    markTab();
  }

  /* ---------- News: show the "(scroll)" hint only when the list is taller than its box ---------- */
  var newsBox = document.getElementById('newsBox');
  var newsHint = document.querySelector('.news-hint');
  function checkNews() { if (newsBox && newsHint) newsHint.hidden = newsBox.scrollHeight <= newsBox.clientHeight + 2; }
  checkNews();
  window.addEventListener('load', checkNews);
  window.addEventListener('resize', checkNews);

  /* ---------- Theme: follows the system until the visitor chooses ---------- */
  var themeBtn = document.getElementById('themeBtn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Publications: show one research area ---------- */
  var areaBtns = all('[data-filter]');
  if (areaBtns.length) {
    areaBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-filter');
        areaBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        all('.year-group').forEach(function (group) {
          var shown = 0;
          all('.pub', group).forEach(function (pub) {
            var show = key === 'all' || pub.getAttribute('data-area') === key;
            pub.hidden = !show;
            if (show) shown++;
          });
          group.hidden = shown === 0;
        });
      });
    });
  }

  /* ---------- Blogs: show the posts with one tag (also via /blog/?tag=name) ---------- */
  var tagBtns = all('[data-tag]');
  function showTag(tag) {
    var found = false;
    tagBtns.forEach(function (b) {
      var on = b.getAttribute('data-tag') === tag;
      if (on) found = true;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (!found) { tag = 'all'; tagBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tag') === 'all' ? 'true' : 'false'); }); }
    all('.timeline').forEach(function (list) {
      var shown = all('[data-tags]', list).filter(function (li) {
        var tags = li.getAttribute('data-tags').split('|');
        li.hidden = !(tag === 'all' || tags.indexOf(tag) > -1);
        return !li.hidden;
      });
      /* the rail of the timeline stops at the last post on show; a year with nothing to show is hidden */
      shown.forEach(function (li, i) { li.classList.toggle('tl-last', i === shown.length - 1); });
      var group = list.closest('.year-group');
      if (group) group.hidden = shown.length === 0;
    });
  }
  if (tagBtns.length) {
    tagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { showTag(btn.getAttribute('data-tag')); });
    });
    var wanted = null;
    try { wanted = new URLSearchParams(location.search).get('tag'); } catch (e) {}
    if (wanted) showTag(wanted);
  }

  /* ---------- Posts: the "In this article" list, built from the headings (front matter: toc: true) ---------- */
  var toc = document.getElementById('toc');
  if (toc) {
    var tocList = toc.querySelector('ol');
    var section = null;      /* the list under the current h2 */
    var entries = 0;
    all('.post-body h2[id], .post-body h3[id]').forEach(function (h) {
      if (h.classList.contains('no_toc')) return;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      if (h.tagName === 'H3' && section) {
        if (!section.sub) { section.sub = document.createElement('ol'); section.li.appendChild(section.sub); }
        section.sub.appendChild(li);
      } else {
        tocList.appendChild(li);
        section = h.tagName === 'H2' ? { li: li, sub: null } : null;
      }
      entries++;
    });
    if (entries > 1) {
      if (window.matchMedia && matchMedia('(max-width: 640px)').matches) toc.querySelector('details').open = false;
      toc.hidden = false;
    }
  }

  /* ---------- Image viewer: figures in posts, photos and publication banners ---------- */
  var viewer = document.getElementById('viewer');
  if (viewer && viewer.showModal) {
    var viewerImg = document.createElement('img');
    viewerImg.alt = '';
    viewer.appendChild(viewerImg);
    /* A tall image, such as a poster, is shown at reading width and scrolls; anything else is fitted to the window. */
    viewerImg.addEventListener('load', function () {
      viewer.classList.remove('loading');
      viewer.classList.toggle('tall', viewerImg.naturalHeight > viewerImg.naturalWidth * 1.2);
    });
    viewerImg.addEventListener('error', function () { viewer.classList.remove('loading'); });
    all('.post-body img, [data-zoom]').forEach(function (el) {
      if (el.closest('a') && !el.closest('[data-zoom]')) return;   /* linked images keep their link */
      el.addEventListener('click', function (ev) {
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        ev.preventDefault();
        var src = el.getAttribute('href') || img.currentSrc || img.src;
        if (viewerImg.getAttribute('src') !== src) {      /* a different image: hide the old one until the new one has loaded */
          viewer.classList.remove('tall');
          viewer.classList.add('loading');
          viewerImg.src = src;
        }
        viewerImg.alt = el.getAttribute('data-alt') || img.alt || '';
        viewer.showModal();
        viewer.scrollTop = 0;
      });
    });
    document.getElementById('viewerClose').addEventListener('click', function () { viewer.close(); });
    viewer.addEventListener('click', function (ev) { if (ev.target === viewer) viewer.close(); });
  }
})();
