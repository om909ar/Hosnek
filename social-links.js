(() => {
  function addSocialLinks() {
    const copyright = document.querySelector(".sidebar-copyright");

    if (!copyright || document.querySelector(".hosnek-social-links")) return;

    const social = document.createElement("div");
    social.className = "hosnek-social-links";

    social.innerHTML = `
      <a
        href="https://x.com/om909ar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="حساب عمر على X"
        class="hosnek-social-btn"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
        </svg>
      </a>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .hosnek-social-links {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
      }

      .hosnek-social-btn {
        width: 30px;
        height: 30px;
        border: 1px solid rgba(213, 184, 106, 0.22);
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d5b86a;
        background: rgba(213, 184, 106, 0.05);
        text-decoration: none;
        transition: 0.2s ease;
      }

      .hosnek-social-btn svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
      }

      .hosnek-social-btn:active {
        transform: scale(0.92);
      }
    `;

    document.head.appendChild(style);
    copyright.insertAdjacentElement("afterend", social);
  }

  addSocialLinks();

  const observer = new MutationObserver(addSocialLinks);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
