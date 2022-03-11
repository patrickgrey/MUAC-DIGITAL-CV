// ALL this class code is to animate the detail html (rolls eyes emoji)
class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('.content');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 300,
      easing: 'ease-out'
    });

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}

(function () {

  // Adjust the skills progress bars to reflect progress.
  document.querySelectorAll('.cv-progress-container').forEach((container) => {
    const text = container.querySelector("p");
    const percent = container.dataset.progress || "0";
    const circle = container.querySelector(".cv-progress-ring");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    circle.style.transform = 'rotate(-90deg)';

    // if (percent > 33 && percent <= 66) {
    //   circle.setAttribute("stroke", "var(--cv-yellow)");
    //   text.style.color = "var(--cv-yellow)";
    // }
    // else

    if (percent === "100") {
      circle.setAttribute("stroke", "var(--cv-green)");
      text.style.color = "var(--cv-green)";
    }
  });

  // Init animation of all detail components
  document.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
  });

  let root = document.documentElement;

  function toggleHeader() {
    const header = document.querySelector("header");
    if (document.body.scrollTop > 0 || root.scrollTop > 0) {
      header.classList.add("cv-scroll");
    } else {
      header.classList.remove("cv-scroll");
    }
  }

  function setScrollPaddingHeight() {
    const header = document.querySelector("header");
    const height = header.clientHeight;
    var style = window.getComputedStyle ? getComputedStyle(header, null) : header.currentStyle;
    var marginTop = parseInt(style.marginTop) || 0;
    var marginBottom = parseInt(style.marginBottom) || 0;

    // console.log(height + marginTop + marginBottom);

    // root.style.setProperty("--cv-fixed-header-scroll", (height + marginTop + marginBottom) + "px");
  }

  document.addEventListener('scroll', function (e) {
    toggleHeader();
    setScrollPaddingHeight();
  });

  toggleHeader();
  setScrollPaddingHeight();



  document.querySelectorAll('.cv-menu a').forEach((link) => {
    link.addEventListener("click", function (event) {
      // console.log(event.target);
      // event.preventDefault();
      setScrollPaddingHeight();
      const menu = document.querySelector(".cv-menu");
      menu.removeAttribute("open");
      // setTimeout(function () { event.target.dispatchEvent(new Event('click')); }, 20);
      // event.target.click();
    }, true);
  });

  document.addEventListener("click", function (event) {
    const menu = document.querySelector(".cv-menu");
    if (!menu.contains(event.target)) {
      menu.removeAttribute("open");
    }
  });

})();