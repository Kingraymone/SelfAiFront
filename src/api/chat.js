import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080", // 替换为后端地址
    timeout: 60000,
});

// 流式查询（使用 fetch 而不是 axios，因为 axios 不支持流式 response.body）
export async function chatStream(query, onMessage, onFinish) {
    try {
        const response = await fetch(`${apiClient.defaults.baseURL}/chat-stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                onFinish && onFinish();
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            onMessage && onMessage(chunk);
        }
    } catch (err) {
        console.error("流式请求失败", err);
        onFinish && onFinish(err);
    }
}