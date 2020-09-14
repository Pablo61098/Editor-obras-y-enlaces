// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {ReactInstance} from 'react-360-web';
import Control from './src/control.module';
import RCTWorkInProgressSurface from './RCTWorkInProgressSurface'

init = (bundle, parent, options = {}) => {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [
      ctx => new Control(ctx),
    ],
    customViews: [
      {
        // Add custom native view "RCTSurface" to support surface control
        name: 'RCTWorkInProgressSurface',
        view: RCTWorkInProgressSurface,
      },
    ],
    ...options,
  });

  RCTWorkInProgressSurface.__reactInstance = r360;

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('manageLinks', { 
      /* inpitial props */ 
    }),
    r360.getDefaultSurface()
  );

  // Load the initial environment
  // r360.compositor.setBackground();
}

window.React360 = {init};
