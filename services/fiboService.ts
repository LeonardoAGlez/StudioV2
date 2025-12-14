import { RenderSettings, CameraState } from "../types";

export const generateSceneImageFIBO = async (
  settings: RenderSettings,
  cameraState: CameraState,
  cameraDescription: string,
  referenceImageBase64: string | null
): Promise<string> => {
  const apiKey = (process.env.FIBO_API_KEY as string) || "";
  if (!apiKey) {
    throw new Error("FIBO API Key is missing. Set FIBO_API_KEY in .env.");
  }

  // Use Vite dev proxy to avoid CORS in browser (configurable path)
  const generatePathRaw =
    (process.env.FIBO_GENERATE_PATH as string) || "/fibo/image/generate";

  // Minimal payload per the provided API sample; include structured hints
  const camPos = `x:${cameraState.position[0].toFixed(
    2
  )}, y:${cameraState.position[1].toFixed(
    2
  )}, z:${cameraState.position[2].toFixed(2)}`;
  const basePrompt = `${settings.style} style. ${settings.prompt}. Composition: ${cameraDescription}. Lighting: ${settings.lighting}. Camera: FOV ${cameraState.fov}, Pos[${camPos}]. Aspect ${settings.aspectRatio}.`;

  const payload: any = {
    prompt: basePrompt,
  };

  // Some backends accept an optional reference image to guide composition
  if (referenceImageBase64) {
    const cleanBase64 = referenceImageBase64.split(",")[1];
    payload.reference = { image_base64: cleanBase64, mime_type: "image/png" };
  }

  // Try multiple endpoint patterns to handle vendor variations; allow full URL override
  const candidatePaths = generatePathRaw.startsWith("http")
    ? [generatePathRaw]
    : [
        generatePathRaw,
        generatePathRaw.replace("/image/generate", "/images/generate"),
        generatePathRaw.replace("/image/generate", "/image/text-to-image"),
        generatePathRaw.replace("/image/generate", "/images/text-to-image"),
      ];

  let data: any = null;
  let lastBodyText: string | null = null;
  let lastError: any = null;
  let statusUrl: string | null = null;
  for (const path of candidatePaths) {
    try {
      // Construct headers with a single explicit auth header
      const headers: any = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const preferred = (process.env.FIBO_AUTH_HEADER as string) || "api_token";
      if (preferred.toLowerCase() === "authorization") {
        headers["Authorization"] = `Bearer ${apiKey}`;
      } else if (preferred.toLowerCase() === "x-api-key") {
        headers["x-api-key"] = apiKey;
      } else if (preferred.toLowerCase() === "x-api-token") {
        headers["x-api-token"] = apiKey;
      } else {
        // Default expected by docs
        headers["api_token"] = apiKey;
      }

      const resp = await fetch(path, {
        method: "POST",
        headers: headers as any,
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        lastError = new Error(
          `FIBO request failed (${resp.status}): ${text || resp.statusText}`
        );
        // 404: try next candidate path
        if (resp.status === 404) continue;
        if (resp.status === 401) {
          lastError = new Error(
            `Unauthorized (401): Verify FIBO_API_KEY and required auth header. Try setting FIBO_AUTH_HEADER to one of authorization|api_token|x-api-key|x-api-token.`
          );
        }
        throw lastError;
      }
      const bodyText = await resp.text();
      lastBodyText = bodyText;
      try {
        data = JSON.parse(bodyText);
      } catch (parseErr) {
        throw new Error(`FIBO response was not JSON: ${bodyText}`);
      }
      // Capture async job status URL if present
      statusUrl =
        data?.status_url || data?.result?.status_url || data?.data?.status_url;
      break;
    } catch (e) {
      lastError = e;
      continue;
    }
  }

  if (!data) {
    throw (
      lastError ||
      new Error("FIBO request failed and no alternative path succeeded.")
    );
  }

  // Try common response shapes
  const base64: string | undefined =
    data?.image_base64 ||
    data?.result?.image_base64 ||
    data?.data?.image_base64;
  if (base64) return `data:image/png;base64,${base64}`;

  const urlResult: string | undefined =
    data?.image_url ||
    data?.result?.image_url ||
    data?.data?.url ||
    data?.url ||
    data?.result_url ||
    data?.data?.result_url;
  if (urlResult) return urlResult;

  // If the API is async, it might return a job id; surface a helpful error
  if (statusUrl) {
    // Poll the status endpoint until completion
    const headers: any = { Accept: "application/json" };
    const preferred = (process.env.FIBO_AUTH_HEADER as string) || "api_token";
    if (preferred.toLowerCase() === "authorization") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (preferred.toLowerCase() === "x-api-key") {
      headers["x-api-key"] = apiKey;
    } else if (preferred.toLowerCase() === "x-api-token") {
      headers["x-api-token"] = apiKey;
    } else {
      headers["api_token"] = apiKey;
    }

    const maxAttempts = 20;
    const delayMs = 3000;
    for (let i = 0; i < maxAttempts; i++) {
      const sResp = await fetch(statusUrl, { headers: headers as any });
      const sText = await sResp.text();
      if (!sResp.ok) {
        throw new Error(
          `FIBO status failed (${sResp.status}): ${sText || sResp.statusText}`
        );
      }
      let sData: any = null;
      try {
        sData = JSON.parse(sText);
      } catch (err) {
        throw new Error(`FIBO status non-JSON: ${sText}`);
      }

      const sBase64: string | undefined =
        sData?.image_base64 ||
        sData?.result?.image_base64 ||
        sData?.data?.image_base64;
      if (sBase64) return `data:image/png;base64,${sBase64}`;

      const sUrl: string | undefined =
        sData?.image_url ||
        sData?.result?.image_url ||
        sData?.data?.url ||
        sData?.url ||
        sData?.result_url ||
        sData?.data?.result_url;
      if (sUrl) return sUrl;

      const status: string | undefined =
        sData?.status || sData?.result?.status || sData?.data?.status;
      if (status && ["failed", "error"].includes(status.toLowerCase())) {
        throw new Error(
          `FIBO generation failed at status endpoint. Body: ${sText}`
        );
      }

      // Pending: wait and retry
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(
      `FIBO status polling timed out without image. Last status url: ${statusUrl}`
    );
  }

  const keys = data ? Object.keys(data) : [];
  const detail = lastBodyText ? ` Body: ${lastBodyText}` : "";
  throw new Error(
    `FIBO response did not include image_base64 or image_url. Keys: [${keys.join(
      ","
    )}].${detail}`
  );
};
