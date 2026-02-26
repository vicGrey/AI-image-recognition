🖼️ AI Image Recognizer – Frontend
==================================

A lightweight React client for the **AI Image Recognizer** – a serverless AWS application that detects objects or recognizes celebrities in uploaded images.

✨ Features
----------

*   **Upload & Preview** – Drag‑and‑drop or click to select an image (JPEG, PNG, WebP). Instant preview via FileReader data URL.
    
*   **Two Analysis Modes** – Toggle between **Object Detection** and **Celebrity Recognition**.
    
*   **WebP Support** – Automatically converts WebP to JPEG in the browser using Canvas.
    
*   **Clean Results** – Displays labels/celebrities with confidence scores; celebrity links (IMDb, Wikipedia) when available.
    
*   **Mobile Responsive** – Built with Tailwind CSS.
    

🛠️ Tech Stack
--------------

*   React (TypeScript) + Vite
    
*   Tailwind CSS + Lucide icons
    
*   FileReader API (preview) + Canvas (WebP conversion)
    
*   Fetch API (backend communication)
    

🚀 Local Development
--------------------
---

```
git clone [https://github.com/yourusername/ai-image-recognition.git](https://github.com/yourusername/Ai-image-recognition.git)
cd Ai-image-recognition/frontend
npm install
```

Open src/pages/Index.tsx and replace API\_URL with your actual API Gateway endpoint (e.g., https://your-api.execute-api.region.amazonaws.com/dev/upload).


```
npm run dev
```

Visit http://localhost:8000. or any port

📦 Production Build
-------------------

```
npm run build
```
Deploy the dist/ folder to any static host (S3, Netlify, etc.).

👤 Author
---------

**Victor Okoroafor**

## Connect with Me

- [LinkedIn](https://www.linkedin.com/in/victor-okoroafor-cloud)
- [X (Twitter)](https://x.com/OkoroaforVic)
- [GitHub](https://github.com/vicGrey)
