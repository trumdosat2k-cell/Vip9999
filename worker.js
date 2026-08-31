export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API trò chuyện
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();

        if (!message) {
          return Response.json(
            { error: "Bạn chưa nhập câu hỏi." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "Bạn là VIP.9999, trợ lý AI tiếng Việt. " +
                  "Trả lời rõ ràng, hữu ích và chính xác. " +
                  "Không hỗ trợ yêu cầu phạm pháp hoặc gây hại."
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return Response.json({
          answer: result.response || "AI không trả về câu trả lời."
        });

      } catch (error) {
        return Response.json(
          {
            error: "Backend AI gặp lỗi.",
            detail: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
