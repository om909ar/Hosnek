(() => {
  const EHSAN_URL =
    "https://ehsan.sa/FastDonation/4E86EDC4C3042EF62F37723DCCA606D07C5BB1BDDDE928702746A3DDF2B65488CC057938E56E925F89F0FF2F621EFD78";

  function addEhsanLink() {
    const list = document.querySelector(".extra-list");

    if (!list || document.querySelector(".ehsan-fast-donation")) return;

    const button = document.createElement("button");

    button.className = "extra-link ehsan-fast-donation";
    button.type = "button";

    button.innerHTML = `
      <span class="extra-icon">
        <svg viewBox="0 0 24 24"
             width="15"
             height="15"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round"
             aria-hidden="true">
          <path d="M12 20s-7-4.3-7-9.4A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7 2.9C19 15.7 12 20 12 20Z"/>
          <path d="M8.7 12.2c1.8.2 2.8 1.1 3.3 2.5"/>
          <path d="M15.3 12.2c-1.8.2-2.8 1.1-3.3 2.5"/>
        </svg>
      </span>

      <span>التبرع السريع عبر إحسان</span>
    `;

    button.addEventListener("click", () => {
  window.location.href = EHSAN_URL;
});

    const feedback = list.querySelector(".feedback-link");

    if (feedback) {
      list.insertBefore(button, feedback);
    } else {
      list.appendChild(button);
    }
  }

  addEhsanLink();

  const observer = new MutationObserver(addEhsanLink);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
