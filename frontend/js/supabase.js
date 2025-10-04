// Supabase data loader (frontend-only)
// 1) Set your Supabase URL and ANON KEY below
// 2) Define tables that match your content (news, statements, articles, interviews, reports, media, events)

(function () {
  // TODO: replace with your project values from https://app.supabase.com
  const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR-PROJECT.ref.supabase.co';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_ANON_PUBLIC_KEY';

  if (!window.supabase) {
    console.warn('Supabase client script not found.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function loadList({ table, containerId, mapItem }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 mt-4">جاري التحميل...</p>
      </div>
    `;

    const { data, error } = await client
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(24);

    if (error) {
      console.error(`Supabase load error for ${table}:`, error);
      container.innerHTML = `<p class="text-center text-red-600">تعذر تحميل المحتوى.</p>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `<p class="text-center text-gray-500">لا يوجد محتوى متاح حالياً</p>`;
      return;
    }

    container.innerHTML = data.map(mapItem).join('');
  }

  // Mapping helpers
  const mapArticle = (type) => (row) => {
    const title = row.title || 'بدون عنوان';
    const content = row.content || row.description || '';
    const excerpt = content.length > 160 ? content.slice(0, 160) + '…' : content;
    const dateStr = (row.published_at || row.created_at || '').slice(0, 10);
    const badge = {
      news: 'أخبار',
      statements: 'بيانات',
      articles: 'مقالات',
      interviews: 'حوارات',
      reports: 'تقارير',
    }[type] || type;

    return `
      <article class="flex flex-col sm:flex-row-reverse gap-4 items-start bg-white p-6 rounded-lg shadow-md">
        <div class="flex-1 text-right">
          <div class="flex items-center justify-between mb-2">
            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${badge}</span>
            <span class="text-gray-500 text-sm">${dateStr}</span>
          </div>
          <a href="#" class="block font-bold text-gray-800 hover:underline text-lg mb-2">${title}</a>
          <p class="text-gray-600 text-sm">${excerpt}</p>
        </div>
      </article>`;
  };

  const mapMedia = (row) => {
    const title = row.title || 'بدون عنوان';
    const description = row.description || '';
    const url = row.url || row.media_url || '';
    return `
      <div class="group cursor-pointer bg-white p-4 rounded-lg shadow-md">
        <div class="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden mb-3">
          ${url ? `<img src="${url}" alt="${title}" class="w-full h-full object-cover">` : ''}
        </div>
        <h4 class="text-lg font-medium text-gray-800 mb-1">${title}</h4>
        <p class="text-gray-600 text-sm">${description}</p>
      </div>`;
  };

  const mapEvent = (row) => {
    const title = row.title || 'بدون عنوان';
    const description = row.description || '';
    const date = row.date || (row.event_date || '').slice(0, 10);
    const time = row.time || '';
    const location = row.location || '';
    return `
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">${title}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mb-4">
          ${date ? `<p><span class="font-semibold">التاريخ:</span> ${date}</p>` : ''}
          ${time ? `<p><span class="font-semibold">الوقت:</span> ${time}</p>` : ''}
          ${location ? `<p class="sm:col-span-2"><span class="font-semibold">الموقع:</span> ${location}</p>` : ''}
        </div>
        <p class="text-gray-700">${description}</p>
      </div>`;
  };

  // Auto-load when page is shown (using MutationObserver like previous CMS)
  document.addEventListener('DOMContentLoaded', function () {
    const configs = [
      { page: '#news-page', container: 'news-content', table: 'news', mapper: mapArticle('news') },
      { page: '#statements-page', container: 'statements-content', table: 'statements', mapper: mapArticle('statements') },
      { page: '#articles-page', container: 'articles-content', table: 'articles', mapper: mapArticle('articles') },
      { page: '#interviews-page', container: 'interviews-content', table: 'interviews', mapper: mapArticle('interviews') },
      { page: '#reports-page', container: 'reports-content', table: 'reports', mapper: mapArticle('reports') },
      { page: '#media-page', container: 'media-content', table: 'media', mapper: mapMedia },
      { page: '#events-page', container: 'events-content', table: 'events', mapper: mapEvent },
    ];

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target;
          if (!el.classList.contains('hidden')) {
            const cfg = configs.find((c) => c.page === `#${el.id}`);
            if (cfg) loadList({ table: cfg.table, containerId: cfg.container, mapItem: cfg.mapper });
          }
        }
      });
    });

    configs.forEach((c) => {
      const el = document.querySelector(c.page);
      if (el) observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    });

    // Also load immediately if the hash matches on first load
    const hash = window.location.hash;
    const now = configs.find((c) => c.page === hash);
    if (now) loadList({ table: now.table, containerId: now.container, mapItem: now.mapper });
  });
})();


