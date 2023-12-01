// Preloader
export const preload = {
  elem: document.createElement('div'),
  content: `
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  `,
  add(container) {
    container.style.position = 'relative';
    container.append(this.elem);
  },
  remove(container) {
    setTimeout(() => {
      this.elem.remove();
      container.style = '';
      document.querySelector(".preload")?.remove();
      document.head.querySelector("style#preloader")?.remove();
    }, 500);
  },
  init() {
    this.elem.className = 'preload';
    this.elem.innerHTML = this.content;
  },
};
