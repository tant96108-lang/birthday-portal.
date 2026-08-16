// login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Prevent multiple rapid clicks
      if (loginBtn && loginBtn.disabled) return;

      const birthday = document.getElementById("loginBirthday").value;
      const password = document.getElementById("loginPassword").value;

      // 1. Sanitize nickname/password (matches signup sanitization)
      const sanitizedNickname = password.toLowerCase().replace(/[^a-z0-9]/g, "");

      // 2. Reconstruct the unique email: nickname.birthday@birthday.com
      const uniqueEmail = `${sanitizedNickname}.${birthday}@birthday.com`;

      // UI Feedback: Disable button while processing
      const originalBtnHTML = loginBtn ? loginBtn.innerHTML : "✨ Log In";
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = `Logging In...`;
      }

      try {
        // 3. Authenticate with Supabase using password
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
          email: uniqueEmail,
          password: password,
        });

        if (error) {
          alert("Login Failed: Incorrect birth date or nickname.");
          console.error("Supabase Error:", error);
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnHTML;
          }
          return;
        }

        alert("Welcome back! 🎉");
        // Redirect to your main application page
        window.location.href = "index.html";

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred: " + err.message);
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
});