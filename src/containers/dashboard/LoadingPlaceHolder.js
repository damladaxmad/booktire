// import React from 'react';

// export const containerStyles = {
//   width: '100%',
//   height: '100%',
//   position: 'relative'
// };

// function LoadingPlaceHolder(props) {
//   const loaderStyles = {
//     backgroundColor: '#eee',
//     width: '100%',
//     overflow: 'hidden',
//     position: props.container ? 'absolute' : 'relative',
//     ...props.extraStyles
//   };

//   const loaderSwipeStyles = {
//     position: 'absolute',
//     top: '0',
//     left: '0',
//     width: '100%',
//     background: `linear-gradient(to right, #01545C 10%, #eeeeee 50%, #01545C 90%)`,
//     animation: 'loaderSwipeAnim 1.5s linear infinite',
//     height: '100%'
//   };

//   const keyframes = `
//     @keyframes loaderSwipeAnim {
//       0% {
//         transform: translateX(-100%);
//       }
//       100% {
//         transform: translateX(100%);
//       }
//     }
//   `;

//   const style = document.createElement('style');
//   style.type = 'text/css';
//   style.appendChild(document.createTextNode(keyframes));
//   document.head.appendChild(style);

//   return (
//     <div style={loaderStyles}>
//       <div style={loaderSwipeStyles}></div>
//     </div>
//   );
// }

// export default LoadingPlaceHolder;

import React from 'react';

export const containerStyles = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

function LoadingPlaceHolder(props) {
  const loaderStyles = {
    backgroundColor: '#eee',
    // backgroundColor: '#B2CBCE',
    width: '100%',
    marginBottom: "5px",
    overflow: 'hidden',
    position: props.container ? 'absolute' : 'relative',
    ...props.extraStyles
  };

  const loaderSwipeStyles = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    background: 'linear-gradient(to right, #eeeeee 10%, #dddddd 50%, #eeeeee 90%)',
    animation: 'loaderSwipeAnim 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
    height: '80%'
  };

  // Define the keyframes for the animation
  const keyframes = `
    @keyframes loaderSwipeAnim {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;

  // Create a style element to include the keyframes
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(keyframes));
  document.head.appendChild(style);

  return (
    <div style={loaderStyles}>
      <div style={loaderSwipeStyles}></div>
    </div>
  );
}

export default LoadingPlaceHolder;

