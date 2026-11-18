let solverOverride

export function setCaptchaSolverForTests(solver) {
  solverOverride = solver
}

export async function getCaptchaToken(clientConfig) {
  const captcha = clientConfig?.configs?.captcha
  if (captcha == null || captcha.enabled === false) return null
  if (typeof captcha !== "object" || Array.isArray(captcha)) throw new Error("ZCode CAPTCHA configuration is unreadable")
  const scene = typeof captcha.sceneId === "string" ? captcha.sceneId.trim() : ""
  const prefix = typeof captcha.prefix === "string" ? captcha.prefix.trim() : ""
  const region = typeof captcha.region === "string" ? captcha.region.trim() : ""
  if (!scene || !prefix) throw new Error("ZCode CAPTCHA configuration is incomplete")
  const solve = solverOverride ?? (await import("./captcha-happy.mjs")).solveTraceless
  const verifyParam = await solve({ scene, prefix, region })
  if (typeof verifyParam !== "string" || !verifyParam.trim()) throw new Error("Aliyun CAPTCHA solver returned an empty proof")
  return { verifyParam: verifyParam.trim(), ...(region ? { region } : {}) }
}
