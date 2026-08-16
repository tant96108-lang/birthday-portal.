<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Birthday Portal - Dashboard</title>
  <style>
    :root {
      --primary-color: #e60023;
      --secondary-color: #8b0000;
      --accent-color: #f8d7da;
      --bg-gradient-1: #800020;
      --bg-gradient-2: #cc0000;
      --card-bg: rgba(255, 255, 255, 0.95);
      --text-main: #2b0006;
      --border-radius-lg: 20px;
      --box-shadow: 0 10px 25px rgba(139, 0, 0, 0.25);
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --env-bg: #ff758c;
      --env-flap: #ff7f95;
      --env-inner: #ff8fa3;
      --paper-bg: #ffffff;
      --accent: #d63384;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html { height: 100%; font-family: var(--font-family); color: var(--text-main); overflow-x: hidden; }

    .birthday-bg {
      background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    .dashboard-container {
      width: 100%; max-width: 650px; padding: 20px; z-index: 10; margin: 20px auto;
    }

    .dashboard-card {
      background: var(--card-bg); border-radius: var(--border-radius-lg);
      padding: 30px; box-shadow: var(--box-shadow); text-align: left;
    }

    .user-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; border-bottom: 2px dashed #fecfef; padding-bottom: 15px;
    }

    .logout-btn {
      padding: 8px 16px; font-size: 0.85rem;
      background: linear-gradient(45deg, #ff6b6b, #d63384); color: #fff;
      border: none; cursor: pointer; border-radius: 10px; font-weight: bold;
    }

    .special-actions-box {
      background: #fff5f8; border: 2px solid #fecfef; border-radius: 14px;
      padding: 15px; margin-bottom: 20px; text-align: center;
    }

    .special-btn {
      background: linear-gradient(45deg, #ff6b6b, #ff8e53); color: white;
      border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;
    }

    /* Envelope & Interactive Letter */
    .greeting-section-wrapper { display: flex; flex-direction: column; align-items: center; margin: 20px 0 60px 0; }
    .envelope-wrapper {
      position: relative; width: 320px; height: 220px; background-color: var(--env-bg);
      border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.15); cursor: pointer; perspective: 1000px;
      margin-top: 20px; margin-bottom: 20px; transition: transform 0.6s ease-in-out;
    }
    .envelope-flap {
      position: absolute; top: 0; left: 0; width: 0; height: 0;
      border-left: 160px solid transparent; border-right: 160px solid transparent;
      border-top: 125px solid var(--env-flap); transform-origin: top; transition: transform 0.6s ease 0.4s; z-index: 5;
    }
    .envelope-seal { position: absolute; top: 35px; left: 50%; transform: translateX(-50%); font-size: 28px; z-index: 6; }
    .envelope-pocket {
      position: absolute; bottom: 0; left: 0; width: 0; height: 0;
      border-left: 160px solid var(--env-inner); border-right: 160px solid var(--env-inner);
      border-bottom: 110px solid var(--env-bg); border-top: 110px solid transparent;
      border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; z-index: 4;
    }
    .letter {
      position: absolute; bottom: 10px; left: 15px; width: 290px; min-height: 200px;
      background: var(--paper-bg); border-radius: 10px; padding: 20px; box-sizing: border-box;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08); z-index: 3;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s; opacity: 0;
    }

    .envelope-wrapper.open { transform: translateY(140px); cursor: default; }
    .envelope-wrapper.open .envelope-flap { transform: rotateX(180deg); z-index: 1; }
    .envelope-wrapper.open .envelope-seal { opacity: 0; }
    .envelope-wrapper.open .letter { transform: translateY(-210px); z-index: 10; opacity: 1; }

    .letter-title { color: var(--accent); font-size: 1.2rem; margin-bottom: 12px; text-align: center; border-bottom: 2px dashed #fecfef; padding-bottom: 8px; }
    .greeting-body { font-size: 0.95rem; line-height: 1.5; color: #444; margin-bottom: 20px; white-space: pre-line; max-height: 200px; overflow-y: auto; }
    
    .feedback-section { margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; }
    .feedback-section label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--accent); margin-bottom: 6px; }
    .feedback-section textarea { width: 100%; padding: 8px; border: 1px solid #ffccd5; border-radius: 6px; font-size: 0.85rem; }
    .feedback-btn { width: 100%; margin-top: 8px; padding: 8px; background: var(--accent); color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }

    /* Wishes Feed */
    .wish-form { margin-bottom: 30px; background: #ffffff; padding: 18px; border-radius: 16px; border: 2px solid #fecfef; }
    .wish-form textarea { width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 12px; min-height: 80px; }
    .celebration-btn { background: linear-gradient(45deg, #ff6b6b, #d63384); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; }
    .wish-card { background: #ffffff; border: 2px solid #fecfef; border-radius: 14px; padding: 16px; margin-bottom: 15px; }
    .wish-card .author { font-weight: bold; color: #d63384; margin-bottom: 6px; }
    .wish-card .time { font-size: 0.75rem; color: #888888; text-align: right; margin-top: 10px; }
  </style>
</head>
<body class="birthday-bg">

  <div class="dashboard-container">
    <div class="dashboard-card">
      
      <!-- User Header -->
      <div class="user-header">
        <div>
          <h2 id="welcomeUser">Happy Birthday!</h2>
        </div>
        <button id="logoutBtn" class="logout-btn">🚪 Log Out</button>
      </div>

      <!-- Actions Container -->
      <div id="userActionsContainer" class="special-actions-box"></div>

      <!-- Envelope Greeting Section -->
      <div class="greeting-section-wrapper">
        <div class="envelope-wrapper" id="envelope">
          <div class="envelope-flap"></div>
          <div class="envelope-seal">💌</div>
          <div class="envelope-pocket"></div>

          <div class="letter" id="letter">
            <h3 class="letter-title" id="letterTitle">Dear Celebrant,</h3>
            <div class="greeting-body" id="greetingContent">
              Wishing you a joyful birthday filled with happiness! 🎂✨
            </div>

            <div class="feedback-section">
              <label for="feedbackMsg">Send a Thank You Note:</label>
              <textarea id="feedbackMsg" rows="2" placeholder="Write something sweet back..."></textarea>
              <button id="sendFeedbackBtn" class="feedback-btn">Send Note ✨</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Wish Form -->
      <div class="wish-form">
        <label style="font-weight: 600; color: #d63384; display: block; margin-bottom: 8px;">🎁 Post a Birthday Wish</label>
        <form id="postWishForm">
          <textarea id="wishInput" placeholder="Write something magical..." required></textarea>
          <button type="submit" id="sendWishBtn" class="celebration-btn" style="margin-top: 10px;">✨ Share Celebration</button>
        </form>
      </div>

      <!-- Party Wall Feed -->
      <div>
        <h3 style="color: #d63384; margin-bottom: 15px;">🎉 Party Wall & Greetings</h3>
        <div id="wishesFeed"></div>
      </div>

    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabaseClient.js"></script>

  <script>
    document.addEventListener("DOMContentLoaded", async () => {
      let currentUser = null;
      let currentGreetingId = null;

      const welcomeUser = document.getElementById("welcomeUser");
      const userActionsContainer = document.getElementById("userActionsContainer");
      const envelope = document.getElementById("envelope");
      const letterTitle = document.getElementById("letterTitle");
      const greetingContent = document.getElementById("greetingContent");
      const feedbackMsg = document.getElementById("feedbackMsg");
      const sendFeedbackBtn = document.getElementById("sendFeedbackBtn");
      const feedContainer = document.getElementById("wishesFeed");
      const postWishForm = document.getElementById("postWishForm");
      const wishInput = document.getElementById("wishInput");

      // Verify Session
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      if (!user) {
        window.location.href = "index.html";
        return;
      }
      currentUser = user;

      // Setup Dashboard
      const userMeta = currentUser.user_metadata || {};
      const nickname = userMeta.nickname || "Party Guest";
      welcomeUser.textContent = `Happy Birthday, ${nickname}! 🥳`;

      if (currentUser.email && currentUser.email.startsWith("mimi.")) {
        userActionsContainer.innerHTML = `<button class="special-btn" onclick="alert('🎁 Happy Birthday Mimi!')">🎁 Open Mimi's Gift</button>`;
      } else {
        userActionsContainer.innerHTML = `<p>Welcome to the celebration, <strong>${nickname}</strong>!</p>`;
      }

      // Load Data
      await checkForGreeting(nickname);
      await loadWishes();

      // Envelope Interactions
      envelope.addEventListener("click", (e) => {
        if (!e.target.closest(".feedback-section")) {
          envelope.classList.add("open");
        }
      });

      sendFeedbackBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const feedback = feedbackMsg.value.trim();
        if (!feedback) return alert("Please write a note!");

        if (currentGreetingId) {
          await window.supabaseClient.from("greetings").update({ feedback }).eq("id", currentGreetingId);
        }
        alert("Thank you! Note sent. 🎉");
        feedbackMsg.value = "";
      });

      // Post Wish
      postWishForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = wishInput.value.trim();
        if (!msg) return;

        const { data, error } = await window.supabaseClient.from("wishes").insert([{ guest_name: nickname, message: msg }]).select();
        if (!error && data.length) {
          renderWishCard(nickname, msg, data[0].created_at, true);
          wishInput.value = "";
        }
      });

      // Logout
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await window.supabaseClient.auth.signOut();
        window.location.href = "index.html";
      });

      async function checkForGreeting(fallbackName) {
        const { data } = await window.supabaseClient.from("greetings").select("*").or(`recipient_email.eq.${currentUser.email},celebrant_email.eq.${currentUser.email}`).limit(1).maybeSingle();
        if (data) {
          currentGreetingId = data.id;
          letterTitle.innerText = `Dear ${data.name || fallbackName},`;
          greetingContent.innerText = data.greeting_message || data.message;
        }
      }

      async function loadWishes() {
        const { data: wishes } = await window.supabaseClient.from("wishes").select("*").order("created_at", { ascending: false });
        feedContainer.innerHTML = "";
        (wishes || []).forEach(w => renderWishCard(w.guest_name || "Guest", w.message, w.created_at));
      }

      function renderWishCard(author, message, time, prepend = false) {
        const card = document.createElement("div");
        card.className = "wish-card";
        card.innerHTML = `<div class="author">🎈 ${author}</div><div>${message}</div><div class="time">${new Date(time).toLocaleString()}</div>`;
        prepend ? feedContainer.prepend(card) : feedContainer.appendChild(card);
      }
    });
  </script>
</body>
</html>