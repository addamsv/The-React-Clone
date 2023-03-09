/** ⬇️ 🌼 Real React Component 🌼 ⬇️ **/
export interface Element {
  $$typeof: symbol; // ('react.element')
  key: null;
  ref: null;
  _owner: {
    flag?: number;
    index?: number;
    sibling?: string;
  };
  type: string | symbol | any; // | Component
  props: any;
}

export interface IComponent {
  render: () => any;

  componentDidMount?: () => any;

  componentWillUnmount?: () => any;

  componentDidCatch?: () => any;
}

export type ReactNode = string | number | boolean | null | undefined | any; // | ReactElement | ReactFragment | ReactPortal;
