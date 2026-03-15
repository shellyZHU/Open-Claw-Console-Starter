/* global tt */

const APP_ID = "cli_a93e460d0da15cee";

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

function setOutput(text) {
  document.getElementById("output").textContent = text;
}

function ensureFeishuRuntime() {
  if (typeof tt === "undefined" || typeof tt.requestAuthCode !== "function") {
    throw new Error("当前页面不在飞书容器中，无法调用 tt.requestAuthCode()");
  }
}

function requestAuthCode() {
  return new Promise((resolve, reject) => {
    tt.requestAuthCode({
      appId: APP_ID,
      success(res) {
        resolve(res.code);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

async function handleGetCode() {
  setStatus("正在请求 auth code...");
  setOutput("请求中...");

  try {
    ensureFeishuRuntime();
    const code = await requestAuthCode();
    setStatus("已成功拿到 auth code。复制后回到本地脚本继续换 token。");
    setOutput(code || "返回成功，但没有拿到 code。");
  } catch (error) {
    setStatus("获取失败。请确认当前页面运行在飞书应用容器内。");
    setOutput(JSON.stringify(error, null, 2));
  }
}

async function handleCopyCode() {
  const text = document.getElementById("output").textContent.trim();
  if (!text || text === "尚未获取。" || text === "请求中...") {
    setStatus("还没有可复制的 code。先点“获取 Auth Code”。");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Code 已复制。现在回本地运行 exchange-auth-code 命令。");
  } catch {
    setStatus("复制失败，手动长按复制下面的 code 即可。");
  }
}

document.getElementById("get-code").addEventListener("click", handleGetCode);
document.getElementById("copy-code").addEventListener("click", handleCopyCode);
