interface ICrProto {
  rwd5000?: any;
  rwd1200?: any;
  rwd992?: any;
  rwd600?: any;
  rwd320?: any;

  akf5000k0?: any;
  akf5000k1?: any;
  akf5000k2?: any;
  akf5000k3?: any;
  akf5000k4?: any;
  akf5000k5?: any;
  akf5000k6?: any;
  akf5000k7?: any;
  akf5000k8?: any;
  akf5000k9?: any;
  akf5000k10?: any;

  grd5000k0?: any;
  grd5000k1?: any;
  grd5000k2?: any;
  grd5000k3?: any;
  grd5000k4?: any;
  grd5000k5?: any;
  grd5000k6?: any;
  grd5000k7?: any;
  grd5000k8?: any;
  grd5000k9?: any;
  grd5000k10?: any;

  bsc0?: any;
  bsc1?: any;
  bsc2?: any;
  bsc3?: any;
  bsc4?: any;
  bsc5?: any;
  bsc6?: any;
  bsc7?: any;
  bsc8?: any;
  bsc9?: any;
  bsc10?: any;

  cs: {
    priority: string,
    type: string
  }
}

interface ItemInterface extends ICrProto {
  tsc0?: any;
  tsc1?: any;
  tsc2?: any;
  tsc3?: any;
  tsc4?: any;
  tsc5?: any;
  tsc6?: any;
  tsc7?: any;
  tsc8?: any;
  tsc9?: any;
  tsc10?: any;
}

interface IContainer extends ICrProto  {
  c0?: IContainer;
  c1?: IContainer;
  c2?: IContainer;
  c3?: IContainer;
  c4?: IContainer;
  c5?: IContainer;
  c6?: IContainer;
  c7?: IContainer;
  c8?: IContainer;
  c9?: IContainer;
  c10?: IContainer;
  i0?: ItemInterface;
  i1?: ItemInterface;
  i2?: ItemInterface;
  i3?: ItemInterface;
  i4?: ItemInterface;
  i5?: ItemInterface;
  i6?: ItemInterface;
  i7?: ItemInterface;
  i8?: ItemInterface;
  i9?: ItemInterface;
  i10?: ItemInterface;
}

interface ISection {
  hdr: {
    cs: {
      priority?: string;
      type: string,
      ptID: string,
      minorVer: string | number,
      description: string,
      heightPercent: string,
      name: string,
      postType: string,
      palettes?: Array<{
        hexColor: string,
        opacity: string,
        name?: string
      }>;
    }
    altRWD: Array<{
      resolution: string;
      description: string;
    }> | undefined;
  }

  /** Slides */
  c0?: IContainer;
  c1?: IContainer;
  c2?: IContainer;
  c3?: IContainer;
  c4?: IContainer;
  c5?: IContainer;
  c6?: IContainer;
  c7?: IContainer;
  c8?: IContainer;
  c9?: IContainer;
  c10?: IContainer;
}
