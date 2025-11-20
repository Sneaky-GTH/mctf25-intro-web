// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

class RipplePopup {
  _resolveViewportValue(value, axis) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    value = value.trim();

    if (value.endsWith('vw')) return (window.innerWidth * parseFloat(value)) / 100;
    if (value.endsWith('vh')) return (window.innerHeight * parseFloat(value)) / 100;
    if (value.endsWith('%')) return axis === 'w' ? (window.innerWidth * parseFloat(value))/100 : (window.innerHeight * parseFloat(value))/100;

    return parseFloat(value) || 0;
  }

  constructor(options = {}) {
    this.options = Object.assign({
      rippleColor: 'rgba(0, 150, 255, 0.45)',
      rippleMaxRadius: 80,
      rippleDuration: 1200,
      repeatInterval: 2000,
      imageSize: 128,
      canvasZIndex: 999990,
      popupZIndex: 999999,
    }, options);

    this.ripples = new Map();

    // Canvas ignores pointer events entirely to allow full page interaction
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = this.options.canvasZIndex;
    this.canvas.setAttribute('aria-hidden', 'true');

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.resize);

    // Global click listener for ripple detection
    document.addEventListener('click', (e) => this._handleDocumentClick(e));

    this.running = false;
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const r of this.ripples.values()) {
      if (r.originalX !== undefined) r.x = this._resolveViewportValue(r.originalX, 'w') + window.scrollX;
      if (r.originalY !== undefined) r.y = this._resolveViewportValue(r.originalY, 'h') + window.scrollY;
    }
  }

  trigger(x, y, messageId, messageContent = '', imageSrc = null) {
    const originalX = x, originalY = y;
    const px = this._resolveViewportValue(x, 'w') + window.scrollX;
    const py = this._resolveViewportValue(y, 'h') + window.scrollY;

    let ripple = this.ripples.get(messageId);
    if (ripple) {
      ripple.originalX = originalX;
      ripple.originalY = originalY;
      ripple.x = px;
      ripple.y = py;
      ripple.messageContent = messageContent;
      ripple.removed = false;
      ripple.createdAt = performance.now();
      if (imageSrc) this._loadImageForRipple(ripple, imageSrc);
      if (!this.running) { requestAnimationFrame(this.animate); this.running = true; }
      return;
    }

    ripple = { x: px, y: py, originalX, originalY, messageId, messageContent, createdAt: performance.now(), radius: 0, removed: false, image: null };
    if (imageSrc) this._loadImageForRipple(ripple, imageSrc);
    this.ripples.set(messageId, ripple);

    if (!this.running) { requestAnimationFrame(this.animate); this.running = true; }
  }

  _loadImageForRipple(ripple, src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { ripple.image = img; };
    img.onerror = () => { ripple.image = null; };
    img.src = src;
  }

  _handleDocumentClick(e) {
    if (e.button === 2) return; // ignore right-clicks for normal context menu

    for (const r of this.ripples.values()) {
      if (r.removed) continue;
      const dx = e.clientX - r.x;
      const dy = e.clientY - r.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const hitRadius = Math.max(r.radius, this.options.imageSize/2);
      if (dist <= hitRadius) {
        this.showPopup(r.x, r.y, r.messageId, r.messageContent);
        this.remove(r.messageId);
        break;
      }
    }
  }

  animate(timestamp) {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let active = 0;
    const now = timestamp;
    const dur = this.options.rippleDuration;
    const repeat = this.options.repeatInterval;
    const period = dur + repeat;

    for (const r of this.ripples.values()) {
      if (r.removed) continue;
      active++;

      const elapsed = now - r.createdAt;
      const within = elapsed % period;
      const progress = Math.min(within/dur, 1);
      let radius = this.options.rippleMaxRadius * progress;
      if (!Number.isFinite(radius) || radius < 0) radius = 0;
      r.radius = radius;
      const alpha = 1 - progress;

      if (within <= dur) {
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, radius, 0, Math.PI*2);
        this.ctx.fillStyle = this._replaceAlphaInRgba(this.options.rippleColor, alpha);
        this.ctx.fill();
      }

      if (r.image) {
        const size = this.options.imageSize;
        const half = size/2;
        this.ctx.drawImage(r.image, r.x-half, r.y-half, size, size);
      }
    }

    if (active > 0) requestAnimationFrame(this.animate);
    else this.running = false;
  }

  _replaceAlphaInRgba(rgbaStr, alpha) {
    if (rgbaStr.startsWith('rgba')) return rgbaStr.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (m,r,g,b,a)=>`rgba(${r.trim()},${g.trim()},${b.trim()},${alpha.toFixed(3)})`);
    if (rgbaStr.startsWith('rgb')) return rgbaStr.replace(/rgb\(([^)]+)\)/, (m,inner)=>`rgba(${inner},${alpha.toFixed(3)})`);
    return `rgba(0,150,255,${alpha.toFixed(3)})`;
  }

  showPopup(x, y, msgId, html) {
    const backdrop = document.createElement('div');
    backdrop.style.position='fixed'; backdrop.style.left='0'; backdrop.style.top='0';
    backdrop.style.width='100%'; backdrop.style.height='100%'; backdrop.style.zIndex=this.options.popupZIndex;
    backdrop.style.background='rgba(0,0,0,0.15)'; backdrop.style.display='flex';
    backdrop.style.alignItems='flex-start'; backdrop.style.justifyContent='center'; backdrop.style.pointerEvents='auto';

    const popup=document.createElement('div');
    popup.className='ripple-popup'; popup.style.position='absolute'; popup.style.left=x+'px'; popup.style.top=y+'px';

    if (y < 200) popup.style.top = 200 - y + 'px';
    popup.style.transform='translate(-50%,-50%)'; popup.style.zIndex=this.options.popupZIndex+1;
    popup.style.background='rgba(24, 27, 34, 1)'; popup.style.color='rgba(187,187,187,1)';
    popup.style.border='1px solid #333944ff'; popup.style.padding='15px'; popup.style.borderRadius='8px';
    popup.style.boxShadow='0 8px 30px rgba(0,0,0,0.35)'; popup.style.minWidth='240px'; popup.style.maxWidth='90vw'; popup.style.pointerEvents='auto';

    const closeBtn=document.createElement('button');
    closeBtn.type='button'; closeBtn.innerText='×'; closeBtn.style.color='rgba(187,187,187,1)';
    closeBtn.setAttribute('aria-label','Close'); closeBtn.style.cursor='pointer'; closeBtn.style.position='absolute';
    closeBtn.style.right='8px'; closeBtn.style.top='6px'; closeBtn.style.fontSize='20px'; closeBtn.style.background='transparent'; closeBtn.style.border='none';

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.dispatchEvent(new CustomEvent("ripplePopup:close", {
        detail: { messageId: msgId }
      }));
    });

    popup.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent("ripplePopup:open", {
        detail: { messageId: msgId }
      }));
    });

    backdrop.addEventListener('click',(e)=>{e.stopPropagation(); e.preventDefault();});

    popup.innerHTML=html||''; popup.appendChild(closeBtn); backdrop.appendChild(popup); document.body.appendChild(backdrop);
  }

  remove(messageId) { const ripple=this.ripples.get(messageId); if(ripple){ripple.removed=true; this.ripples.delete(messageId);} }
}

if(typeof module!=='undefined') module.exports=RipplePopup;
