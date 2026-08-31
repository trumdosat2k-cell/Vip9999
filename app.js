const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearMemory");

function addMessage(role, text) {
  const div = document.createElement("div");

  div.className = `message ${role}`;
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function loadMemory() {
  try {
    const response = await fetch("/api/memory");
    const memory = await response.json();

    chat.innerHTML = "";

    for (const message of memory.messages || []) {
      addMessage(message.role, message.content);
    }
  } catch {
    addMessage("assistant", "Chưa kết nối được bộ nhớ.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) return;

  addMessage("user", message);

  messageInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    addMessage(
      "assistant",
      data.answer || data.error || "Có lỗi xảy ra."
    );
  } catch {
    addMessage(
      "assistant",
      "Chưa kết nối backend AI."
    );
  }

  sendButton.disabled = false;
  sendButton.textContent = "Gửi";
});

clearButton.addEventListener("click", async () => {
  await fetch("/api/memory", {
    method: "DELETE"
  });

  chat.innerHTML = "";

  addMessage(
    "assistant",
    "Đã xóa bộ nhớ hội thoại."
  );
});

loadMemory();
