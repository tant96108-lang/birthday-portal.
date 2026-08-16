const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById("loginForm");
const submitBtn = loginForm.querySelector('button[type="submit"]');

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Store original button text/HTML to restore later if needed
  const originalBtnHTML = submitBtn.innerHTML;

  // 1. Set loading state with spinner
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner"></span> Logging in...`;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      // Re-enable button on authentication error
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      return;
    }

    if (data.user) {
      // Redirect to dashboard (keep button disabled while loading next page)
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An error occurred during login. Please try again.");

    // Re-enable button on unexpected script failure
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
});