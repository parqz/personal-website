/* Site-wide behaviour: menu, theme switch, publication and tag filters, image viewer. No dependencies. */
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

  /* ---------- Blog: show one tag (also via /blog/?tag=name) ---------- */
  var tagBtns = all('[data-tag]');
  function showTag(tag) {
    var found = false;
    tagBtns.forEach(function (b) {
      var on = b.getAttribute('data-tag') === tag;
      if (on) found = true;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (!found) { tag = 'all'; tagBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tag') === 'all' ? 'true' : 'false'); }); }
    all('.post-list > li[data-tags]').forEach(function (li) {
      var tags = li.getAttribute('data-tags').split('|');
      li.hidden = !(tag === 'all' || tags.indexOf(tag) > -1);
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

  /* ---------- Image viewer: figures in posts and publication thumbnails ---------- */
  var viewer = document.getElementById('viewer');
  if (viewer && viewer.showModal) {
    var viewerImg = document.createElement('img');
    viewerImg.alt = '';
    viewer.appendChild(viewerImg);
    all('.post-body img, [data-zoom]').forEach(function (el) {
      if (el.closest('a') && !el.closest('[data-zoom]')) return;   /* linked images keep their link */
      el.addEventListener('click', function (ev) {
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        ev.preventDefault();
        viewerImg.src = el.getAttribute('href') || img.currentSrc || img.src;
        viewerImg.alt = img.alt || '';
        viewer.showModal();
      });
    });
    document.getElementById('viewerClose').addEventListener('click', function () { viewer.close(); });
    viewer.addEventListener('click', function (ev) { if (ev.target === viewer) viewer.close(); });
  }
})();
