(() => {
  const splash = document.createElement("div");
  splash.id = "hosnek-splash";

  splash.innerHTML = `
    <div class="hosnek-splash-content">
      <img src="./assets/hosnek-mark.png" alt="حصنك" class="hosnek-splash-logo">

      <h1>حصنك</h1>

      <p>رفيقك اليومي للذكر</p>

      <small>تصميم وتطوير: عمر</small>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #hosnek-splash {
      position: fixed;
      inset: 0;
      z-index: 999999;

      background:
        radial-gradient(
          700px 450px at 50% 35%,
          rgba(42, 94, 72, 0.55),
          transparent 70%
        ),
        linear-gradient(145deg, #081a15, #0c241c);

      display: flex;
      align-items: center;
      justify-content: center;

      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);

      opacity: 1;
      transition: opacity 0.8s ease;
    }

    .hosnek-splash-content {
      text-align: center;
      transform: translateY(-10px);
      animation: hosnekSplashIn 1.2s ease forwards;
    }

    .hosnek-splash-logo {
      width: 105px;
      height: 105px;
      object-fit: contain;
      margin: 0 auto 22px;
      display: block;

      filter: drop-shadow(0 12px 24px rgba(0,0,0,.25));
    }

    #hosnek-splash h1 {
      margin: 0;
      color: #ead9a7;
      font-size: 42px;
      font-family: Tajawal, sans-serif;
      font-weight: 700;
    }

    #hosnek-splash p {
      margin: 8px 0 0;
      color: #f0ecdf;
      font-family: Tajawal, sans-serif;
      font-size: 17px;
    }

    #hosnek-splash small {
      display: block;
      margin-top: 38px;
      color: rgba(234, 217, 167, 0.65);
      font-family: Tajawal, sans-serif;
      font-size: 11px;
    }

    @keyframes hosnekSplashIn {
      from {
        opacity: 0;
        transform: translateY(5px) scale(.94);
      }

      to {
        opacity: 1;
        transform: translateY(-10px) scale(1);
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(splash);

  setTimeout(() => {
    splash.style.opacity = "0";

    setTimeout(() => {
      splash.remove();
      style.remove();
    }, 800);

  }, 3000);
})();
