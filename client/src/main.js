const API_URL = "http://localhost:3000/api/messages";

async function fetchMessages() {
  try {
    const response = await fetch(API_URL);
    const messages = await response.json();

    const list = document.getElementById("messagesList");
    list.innerHTML = "";

    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = `${msg.username} says: "${msg.message}"`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

async function postMessage(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username");
  const messageInput = document.getElementById("message");

  const data = {
    username: usernameInput.value,
    message: messageInput.value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      fetchMessages();
      usernameInput.value = "";
      messageInput.value = "";
    } else {
      console.error("Failed to post message");
    }
  } catch (error) {
    console.error("Error posting message:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMessages();
  const form = document.getElementById("messageForm");
  form.addEventListener("submit", postMessage);
});
