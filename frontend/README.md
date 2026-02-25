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

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/yourusername/ai-image-recognition.git  cd ai-image-recognition/frontend  npm install   `

Open src/pages/Index.tsx and replace API\_URL with your actual API Gateway endpoint (e.g., https://your-api.execute-api.region.amazonaws.com/dev/upload).

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

Visit http://localhost:8000. or any port

📦 Production Build
-------------------

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run build   `

Deploy the dist/ folder to any static host (S3, Netlify, etc.).

👤 Author
---------

**Victor Okoroafor**[GitHub](https://github.com/vicGrey/)[](https://github.com/vicGrey)[LinkedIn]((https://www.linkedin.com/in/victor-okoroafor-cloud))[Twitter](https://x.com/OkoroaforVic)