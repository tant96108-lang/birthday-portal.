// signup.js
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signupBtn = document.getElementById("signupBtn");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Prevent multiple rapid clicks
      if (signupBtn && signupBtn.disabled) return;

      const birthday = document.getElementById("signupBirthday").value;
      const password = document.getElementById("signupPassword").value;

      // 1. Sanitize nickname/password (removes spaces & special characters)
      const sanitizedNickname = password.toLowerCase().replace(/[^a-z0-9]/g, "");

      // 2. Generate unique email using Nickname + Birthday
      const uniqueEmail = `${sanitizedNickname}.${birthday}@birthday.com`;

      // UI Feedback: Disable button while processing
      const originalBtnHTML = signupBtn ? signupBtn.innerHTML : "Create Account";
      if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.innerHTML = `Creating Account...`;
      }

      try {
        // 3. Register with Supabase (saving nickname & birthday to metadata)
        const { data, error } = await window.supabaseClient.auth.signUp({
          email: uniqueEmail,
          password: password,
          options: {
            data: {
              nickname: password, // Store the raw nickname in user_metadata
              birthday_date: birthday,
            },
          },
        });

        if (error) {
          alert("Signup error: " + error.message);
          if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalBtnHTML;
          }
          return;
        }

        alert("Account created successfully! 🎉");
        window.location.href = "login.html";

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred: " + err.message);
        if (signupBtn) {
          signupBtn.disabled = false;
          signupBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
});