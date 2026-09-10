(function () {
  const SUPABASE_URL =
    "https://ggnpqhozioxzctrkmbgd.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_FEWSIWV7TDvQYfZT7rTzwg_oJuQ8t7s";

  const originalFetch =
    window.fetch.bind(window);


  /* =========================
     محاكاة استجابة tRPC
     ========================= */

  function trpc(data) {
    return new Response(
      JSON.stringify([
        {
          result: {
            data: {
              json: data
            }
          }
        }
      ]),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  /* =========================
     قراءة بيانات الطلب
     ========================= */

  function getInput(init) {
    try {
      if (!init || !init.body) {
        return {};
      }

      const body =
        typeof init.body === "string"
          ? JSON.parse(init.body)
          : init.body;

      return (
        body?.["0"]?.json ||
        body?.json ||
        body ||
        {}
      );

    } catch {
      return {};
    }
  }


  /* =========================
     الاتصال بـ Supabase
     ========================= */

  async function sbFetch(
    path,
    options = {}
  ) {
    const headers = {
      apikey: SUPABASE_KEY,
      ...(options.headers || {})
    };

    return originalFetch(
      SUPABASE_URL + path,
      {
        ...options,
        headers
      }
    );
  }


  /* =========================
     تسجيل زيارة الموقع
     ========================= */

  async function recordVisit() {
    try {

      /*
       * لا نحسب دخول المالك كزيارة
       */
      if (
        new URLSearchParams(
          location.search
        ).get("owner") === "1"
      ) {
        return;
      }


      await sbFetch(
        "/rest/v1/site_visits",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Prefer:
              "return=minimal"
          },

          body: JSON.stringify({})
        }
      );

    } catch (error) {

      console.error(
        "Visit tracking error:",
        error
      );

    }
  }


  /*
   * تسجيل الزيارة عند فتح الموقع
   */
  recordVisit();


  /* =========================
     اعتراض طلبات الموقع
     ========================= */

  window.fetch = async function (
    input,
    init
  ) {

    const url =
      typeof input === "string"
        ? input
        : input?.url || "";


    /* =========================
       تسجيل الدخول / معرفة المستخدم
       ========================= */

    if (
      url.includes(
        "/api/trpc/auth.me"
      )
    ) {

      const sessionResponse =
        await sbFetch(
          "/auth/v1/session"
        );


      if (!sessionResponse.ok) {
        return trpc(null);
      }


      const session =
        await sessionResponse.json();


      const user =
        session?.user;


      if (!user) {
        return trpc(null);
      }


      return trpc({
        id: user.id,

        email: user.email,

        role:
          user.app_metadata?.role ===
          "admin"
            ? "admin"
            : "user"
      });
    }


    /* =========================
       تسجيل الخروج
       ========================= */

    if (
      url.includes(
        "/api/trpc/auth.logout"
      )
    ) {

      const sessionResponse =
        await sbFetch(
          "/auth/v1/session"
        );


      if (sessionResponse.ok) {

        const session =
          await sessionResponse.json();


        if (session?.access_token) {

          await sbFetch(
            "/auth/v1/logout",
            {
              method: "POST",

              headers: {
                Authorization:
                  "Bearer " +
                  session.access_token
              }
            }
          );

        }
      }


      return trpc({
        success: true
      });
    }


    /* =========================
       إرسال اقتراح / ملاحظة
       ========================= */

    if (
      url.includes(
        "/api/trpc/suggestions.create"
      )
    ) {

      const input =
        getInput(init);


      const message =
        String(
          input.message || ""
        ).trim();


      if (
        message.length < 2 ||
        message.length > 2000
      ) {

        return new Response(
          JSON.stringify({
            error: {
              message:
                "الاقتراح يجب أن يكون بين حرفين و2000 حرف."
            }
          }),
          {
            status: 400,

            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );
      }


      const response =
        await sbFetch(
          "/rest/v1/suggestions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Prefer:
                "return=minimal"
            },

            body: JSON.stringify({
              message
            })
          }
        );


      if (!response.ok) {

        const error =
          await response.text();


        console.error(
          "Supabase suggestion error:",
          error
        );


        return new Response(
          JSON.stringify({
            error: {
              message:
                "تعذر حفظ الاقتراح."
            }
          }),
          {
            status: 400,

            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );
      }


      /* =========================
         رسالة نجاح للزائر
         ========================= */

      setTimeout(() => {

        const oldToast =
          document.getElementById(
            "hosnek-success-toast"
          );


        if (oldToast) {
          oldToast.remove();
        }


        const toast =
          document.createElement("div");


        toast.id =
          "hosnek-success-toast";


        toast.textContent =
          "وصلتنا ملاحظتك 🤍 شكرًا لك، مشاركتك تساعدنا على تطوير حصنك.";


        toast.style.cssText = `
          position: fixed;
          z-index: 999999;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #d6b36a;
          color: #081a15;
          padding: 13px 22px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0,0,0,.3);
          white-space: nowrap;
          direction: rtl;
        `;


        document.body.appendChild(
          toast
        );


        setTimeout(() => {

          toast.remove();

        }, 5000);

      }, 100);


      return trpc({
        success: true
      });
    }


    /* =========================
       عرض الاقتراحات للمالك
       ========================= */

    if (
      url.includes(
        "/api/trpc/suggestions.list"
      )
    ) {

      const sessionResponse =
        await sbFetch(
          "/auth/v1/session"
        );


      if (!sessionResponse.ok) {
        return trpc([]);
      }


      const session =
        await sessionResponse.json();


      if (
        !session?.access_token ||
        session?.user?.app_metadata?.role !==
          "admin"
      ) {

        return trpc([]);
      }


      const response =
        await sbFetch(
          "/rest/v1/suggestions" +
            "?select=id,message,created_at,is_read" +
            "&order=created_at.desc",
          {
            headers: {
              Authorization:
                "Bearer " +
                session.access_token
            }
          }
        );


      if (!response.ok) {
        return trpc([]);
      }


      const rows =
        await response.json();


      return trpc(
        rows.map((row) => ({
          id: row.id,

          message: row.message,

          createdAt:
            row.created_at,

          status:
            row.is_read
              ? "read"
              : "new"
        }))
      );
    }


    /* =========================
       تحديد الاقتراح كمقروء
       ========================= */

    if (
      url.includes(
        "/api/trpc/suggestions.markRead"
      )
    ) {

      const input =
        getInput(init);


      const sessionResponse =
        await sbFetch(
          "/auth/v1/session"
        );


      if (!sessionResponse.ok) {

        return trpc({
          success: false
        });
      }


      const session =
        await sessionResponse.json();


      if (
        !session?.access_token ||
        session?.user?.app_metadata?.role !==
          "admin"
      ) {

        return trpc({
          success: false
        });
      }


      if (!input.id) {

        return trpc({
          success: false
        });
      }


      const response =
        await sbFetch(
          "/rest/v1/suggestions?id=eq." +
            encodeURIComponent(
              input.id
            ),
          {
            method: "PATCH",

            headers: {
              Authorization:
                "Bearer " +
                session.access_token,

              "Content-Type":
                "application/json",

              Prefer:
                "return=minimal"
            },

            body: JSON.stringify({
              is_read: true
            })
          }
        );


      return trpc({
        success:
          response.ok
      });
    }


    /* =========================
       أي طلب آخر يمر بشكل طبيعي
       ========================= */

    return originalFetch(
      input,
      init
    );

  };


  console.log(
    "Hosnek Supabase bridge loaded"
  );

})();