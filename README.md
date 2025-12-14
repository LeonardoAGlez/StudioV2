<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BY0VIoL0ZtWQHmJVo3pjPF863k65xiqQ

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure environment:
   - For FIBO: add `FIBO_API_URL` and `FIBO_API_KEY` in a `.env` file at project root.
   - (Optional) Gemini fallback: add `GEMINI_API_KEY` or `API_KEY` if you plan to use the Gemini service.
3. Run the app:
   `npm run dev`

### FIBO JSON Prompting

This app sends structured JSON to FIBO derived from your scene settings (lighting, camera, composition, style). The response must include either `image_base64` or `image_url`.
