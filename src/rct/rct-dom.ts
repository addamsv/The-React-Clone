import { instantiate } from "./core/instantiate";

export const ReactDOM = {
  rootInstance: null as any,

  /* react@^18.0.0 */
  createRoot: (container: HTMLElement | null) => {
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
    if (container && container.children.length !== 0) {
      container.innerHTML = "";
    }
    const newInstance = instantiate(element); // Create Public DOM instance

    newInstance.dom.forEach((node: any) => {
      container?.appendChild(node);
    });
  },
};
