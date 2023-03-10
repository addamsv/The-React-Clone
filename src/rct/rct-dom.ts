import { instantiate } from "./core/instantiate/instantiate";

export const ReactDOM = {
  rootInstance: null as any,

  /* react@^18.0.0 */
  createRoot: (container: HTMLElement) => {
    return {
      render: (element: any) => {
        ReactDOM.render(element, container);
      },

      unmount: () => {
        /* if component based on class component -> componentWillUnmount() */
        return true;
      },
    };
  },

  render: (element: any, container: HTMLElement | null) => {
    if (!container) {
      return;
    }

    if (container.children.length !== 0) {
      container.innerHTML = "";
    }

    instantiate(element, container);

    // dom.forEach((node: any) => {
    //   container?.appendChild(node);
    // });
    // Nodes Append into Public DOM
  },
};
