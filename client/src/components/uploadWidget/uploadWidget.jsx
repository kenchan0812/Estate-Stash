import { createContext, useEffect, useState, useCallback } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext(null);

function useCloudinaryScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "cloudinary-upload-widget";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", scriptId);
    script.src = "https://upload-widget.cloudinary.com/global/all.js";

    script.onload = () => setLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Cloudinary script");
      setLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
      if (document.getElementById(scriptId)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return loaded;
}

function UploadWidget({ uwConfig, setState }) {
  const loaded = useCloudinaryScript();
  const initializeCloudinaryWidget = useCallback(() => {
    if (loaded && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          console.log(error);
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setState((prev) => [...prev, result.info.secure_url]);
          }
        }
      );

      myWidget.open();
    }
  }, [loaded, uwConfig, setState]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
        disabled={!loaded}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
