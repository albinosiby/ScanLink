(() => {
  const form = document.querySelector('#qr-form');
  const input = document.querySelector('#url-input');
  const error = document.querySelector('#url-error');
  const result = document.querySelector('#result');
  const qrImage = document.querySelector('#qr-image');
  const destination = document.querySelector('#destination-url');
  const generateButton = document.querySelector('#generate-button');
  const toast = document.querySelector('#toast');
  const controls = ['foreground', 'background', 'size', 'correction'].map((id) => document.querySelector(`#${id}`));
  const state = { url: '', png: '', svg: '', timer: null };
  const icons = window.lucide;
  icons?.createIcons();
  document.querySelector('#year').textContent = new Date().getFullYear();

  function getOptions() { return { foreground: controls[0].value, background: controls[1].value, size: controls[2].value, errorCorrectionLevel: controls[3].value }; }
  function showToast(message) { toast.textContent = message; toast.classList.add('visible'); window.clearTimeout(state.timer); state.timer = window.setTimeout(() => toast.classList.remove('visible'), 2300); }
  function setError(message = '') { error.textContent = message; input.setAttribute('aria-invalid', String(Boolean(message))); }
  function setLoading(loading) { generateButton.setAttribute('aria-busy', String(loading)); generateButton.querySelector('span').textContent = loading ? 'Generating…' : 'Generate QR'; }

  async function generate(url, { scroll = false } = {}) {
    setError(); setLoading(true);
    try {
      const response = await fetch('/api/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, options: getOptions() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not generate this QR code.');
      state.url = data.url; state.png = data.png; state.svg = data.svg;
      qrImage.src = data.png; qrImage.width = Number(getOptions().size); qrImage.height = Number(getOptions().size);
      destination.textContent = data.url; input.value = data.url;
      const wasHidden = result.hidden; result.hidden = false; result.classList.remove('show'); void result.offsetWidth; result.classList.add('show');
      if (scroll && wasHidden) result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    } catch (err) { setError(err.message); result.hidden = !state.url; }
    finally { setLoading(false); }
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); generate(input.value, { scroll: true }); });
  controls.forEach((control) => control.addEventListener('change', () => { if (state.url) generate(state.url); }));
  document.querySelector('#copy-url').addEventListener('click', async () => { if (!state.url) return; try { await navigator.clipboard.writeText(state.url); showToast('URL copied to clipboard'); } catch { showToast('Select and copy the URL above'); } });
  document.querySelectorAll('[data-download]').forEach((button) => button.addEventListener('click', () => { const type = button.dataset.download; const value = type === 'png' ? state.png : state.svg; if (!value) return; const anchor = document.createElement('a'); anchor.download = `qr-code.${type}`; if (type === 'svg') { anchor.href = URL.createObjectURL(new Blob([value], { type: 'image/svg+xml;charset=utf-8' })); setTimeout(() => URL.revokeObjectURL(anchor.href), 0); } else anchor.href = value; anchor.click(); showToast(`${type.toUpperCase()} download started`); }));
  document.querySelector('#reset-button').addEventListener('click', () => { state.url = ''; state.png = ''; state.svg = ''; result.hidden = true; form.reset(); controls[0].value = '#16213e'; controls[1].value = '#ffffff'; controls[2].value = '512'; controls[3].value = 'M'; setError(); input.focus(); document.querySelector('#generator').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  const menu = document.querySelector('.menu-toggle'); const links = document.querySelector('.nav-links');
  menu.addEventListener('click', () => { const isOpen = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(isOpen)); }); links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
})();
