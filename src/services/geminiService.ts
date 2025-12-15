import { GoogleGenAI } from "@google/genai";
import { RenderSettings, CameraState } from "../types";

export const generateSceneImage = async (
  settings: RenderSettings,
  cameraState: CameraState,
  cameraDescription: string,
  referenceImageBase64: string | null
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format camera data for technical context
  const camPos = `x:${cameraState.position[0].toFixed(2)}, y:${cameraState.position[1].toFixed(2)}, z:${cameraState.position[2].toFixed(2)}`;
  const camRot = `x:${cameraState.rotation[0].toFixed(2)}, y:${cameraState.rotation[1].toFixed(2)}, z:${cameraState.rotation[2].toFixed(2)}`;

  const basePrompt = `
    You are a world-class Director of Photography and Concept Artist.
    Task: Render a high-fidelity image based on the following scene description.
    SCENE DESCRIPTION: "${settings.prompt}"
    TECHNICAL PARAMETERS:
    - Camera Description: ${cameraDescription}
    - Camera Coordinates: Position[${camPos}], Rotation[${camRot}], FOV[${cameraState.fov}]
    - Lighting Condition: ${settings.lighting}
    - Visual Style: ${settings.style}
    ${referenceImageBase64 ? "IMPORTANT: Use the provided image as a strict composition guide (ControlNet/Structure reference)." : ""}
  `;

  try {
    const parts: any[] = [{ text: basePrompt }];

    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.split(",")[1];
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64
        }
      });
    }

    let apiAspectRatio = "16:9"; 
    if (["1:1", "3:4", "4:3", "9:16", "16:9"].includes(settings.aspectRatio)) {
      apiAspectRatio = settings.aspectRatio;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: parts },
      config: {
        imageConfig: { aspectRatio: apiAspectRatio as any }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const generateSceneVideo = async (
  settings: RenderSettings,
  referenceImageBase64: string | null
): Promise<string> => {
  // Always use the latest key from process.env which might be updated by window.aistudio
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Veo only supports 16:9 and 9:16
    let targetAspectRatio = "16:9";
    if (settings.aspectRatio === "9:16") {
      targetAspectRatio = "9:16";
    }

    const fullPrompt = `${settings.style} style. ${settings.prompt}. Cinematic lighting: ${settings.lighting}. High quality, 4k.`;

    // Prepare options
    const options: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: fullPrompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: targetAspectRatio as any
      }
    };

    // If we have a proxy image, use it as the starting frame
    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.split(",")[1];
      options.image = {
        imageBytes: cleanBase64,
        mimeType: 'image/png'
      };
    }

    let operation: any = await ai.models.generateVideos(options);

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned");

    // Retrieve the actual video bytes
    // Note: We must append the API key manually for the fetch, or use a proxy. 
    // In a frontend-only context with @google/genai, we usually fetch the blob.
    const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) throw new Error("Failed to download video bytes");
    
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Gemini Video Generation Error:", error);
    throw error;
  }
};
