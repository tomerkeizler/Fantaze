import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App"
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={4} hideIconVariant preventDuplicate>
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

/**  
 * Be aware that the website will only update to the latest version on the 2nd page visit if it as already cached 
 * Learn more about service workers in React: https://create-react-app.dev/docs/making-a-progressive-web-app
 */
registerServiceWorker();