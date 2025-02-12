import { useEffect } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs/dist/grapes.min.js";
import webPlugin from "grapesjs-preset-webpage";
import formPlugin from "grapesjs-plugin-forms";
import basicPlugin from "grapesjs-blocks-basic";
import ReactText from "./simple-react-text";
import BaseReactComponent from "./base-react-component";
import ReactComponents from "./react-components";
import MuiComponents from "./epos";
import grapejsRulers from "grapesjs-rulers";
import tabs from "grapesjs-tabs";
import flexbox from "grapesjs-blocks-flexbox";
import { useNavigate } from "react-router-dom";

const pluginsList = [
  basicPlugin,
  formPlugin,
  webPlugin,
  BaseReactComponent,
  ReactComponents,
  MuiComponents,
  grapejsRulers,
  tabs,
  flexbox,
];

const deviceManagerConfig = {
  devices: [
    { id: "desktop", name: "Desktop", width: "" },
    { id: "tablet", name: "Tablet", width: "768px", widthMedia: "992px" },
    {
      id: "mobilePortrait",
      name: "Mobile portrait",
      width: "320px",
      widthMedia: "575px",
    },
  ],
};

const addCustomBlocks = (editor) => {
  editor.BlockManager.add("my-block-id", {
    label: "ReactText",
    category: "ePOS",
    components: ReactText,
    activate: true,
  });

  editor.BlockManager.add("custom-navbar", {
    label: "Navigation Bar",
    category: "Basic",
    content: `
      <nav class="bg-gray-800 text-white p-4">
        <ul class="flex space-x-6">
          <li><a href="#" class="hover:underline" data-route="/home">Home</a></li>
          <li><a href="#" class="hover:underline" data-route="/about">About</a></li>
          <li><a href="#" class="hover:underline" data-route="/services">Services</a></li>
          <li><a href="#" class="hover:underline" data-route="/contact">Contact</a></li>
        </ul>
      </nav>

      <script>
        setTimeout(() => {
          document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', function(event) {
              event.preventDefault();
              window.parent.postMessage({ type: "navigate", route: this.getAttribute('data-route') }, "*");
            });
          });
        }, 500); 
      </script>
    `,
  });
};

function WebBuilder() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (event) => {
      if (event.data && event.data.type === "navigate") {
        navigate(event.data.route);
      }
    };

    window.addEventListener("message", handleNavigation);
    
    const editor = grapesjs.init({
      container: "#gjs",
      height: "1024px",
      width: "100%",
      plugins: pluginsList,
      deviceManager: deviceManagerConfig,
      storageManager: {
        id: "gjs-",
        type: "local",
        autosave: true,
        storeComponents: true,
        storeStyles: true,
        storeHtml: true,
        storeCss: true,
      },
      canvas: {
        styles: [
          "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
        ],
      },
    });

    addCustomBlocks(editor);

    return () => {
      window.removeEventListener("message", handleNavigation);
    };
  }, [navigate]);

  return <div id="gjs"></div>;
}

export default WebBuilder;
