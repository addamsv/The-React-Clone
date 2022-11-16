
interface IBoxShad {
  priority: string;
  boxShadowBlur?: string;
  boxShadowTB?: string;
  boxShadowLR?: string;
  boxShadowColor?: string;
  boxShadowColorOpacity?: string;
}

interface ITextShad {
  priority: string;
  textShadowSpread?: string;
  textShadowBlur?: string;
  textShadowTB?: string;
  textShadowLR?: string;
  textShadowColor?: string;
  textShadowColorOpacity?: string;
}
interface IGradientPoint {
  grdLinePos: string;
  backgroundColor?: string;
  backgroundColorOpacity?: string;
}

interface IGradientContainer {
  cs: {
    priority: string;
    gradientType?: string;
    gradientPosX?: string;
    gradientPosY?: string;
    gradientAngl?: string;
  };

  grt?: Array<{ cs: IGradientPoint }>;
  grt5000k0?: { cs: IGradientPoint };
  grt5000k1?: { cs: IGradientPoint };
  grt5000k2?: { cs: IGradientPoint };
  grt5000k3?: { cs: IGradientPoint };
  grt5000k4?: { cs: IGradientPoint };
  grt5000k5?: { cs: IGradientPoint };
  grt5000k6?: { cs: IGradientPoint };
  grt5000k7?: { cs: IGradientPoint };
  grt5000k8?: { cs: IGradientPoint };
  grt5000k9?: { cs: IGradientPoint };
  grt5000k10?: { cs: IGradientPoint };
  grt5000k11?: { cs: IGradientPoint };
  grt5000k12?: { cs: IGradientPoint };
}

interface ICrProto {
  cs: {
    priority: string;
    type: string;
  }

  rwd?: Array<{ cs: any }>;
  rwd5000?: { cs: any };
  rwd1200?: { cs: any };
  rwd992?: { cs: any };
  rwd600?: { cs: any };
  rwd320?: { cs: any };

  akf?: Array<{ cs: any }>;
  akf5000k0?: { cs: any };
  akf5000k1?: { cs: any };
  akf5000k2?: { cs: any };
  akf5000k3?: { cs: any };
  akf5000k4?: { cs: any };
  akf5000k5?: { cs: any };
  akf5000k6?: { cs: any };
  akf5000k7?: { cs: any };
  akf5000k8?: { cs: any };
  akf5000k9?: { cs: any };
  akf5000k10?: { cs: any };

  grd?: Array<IGradientContainer>;
  grd5000k0?: IGradientContainer;
  grd5000k1?: IGradientContainer;
  grd5000k2?: IGradientContainer;
  grd5000k3?: IGradientContainer;
  grd5000k4?: IGradientContainer;
  grd5000k5?: IGradientContainer;
  grd5000k6?: IGradientContainer;
  grd5000k7?: IGradientContainer;
  grd5000k8?: IGradientContainer;
  grd5000k9?: IGradientContainer;
  grd5000k10?: IGradientContainer;

  bsc?: Array<{ cs: IBoxShad }>;
  bsc0?: { cs: IBoxShad };
  bsc1?: { cs: IBoxShad };
  bsc2?: { cs: IBoxShad };
  bsc3?: { cs: IBoxShad };
  bsc4?: { cs: IBoxShad };
  bsc5?: { cs: IBoxShad };
  bsc6?: { cs: IBoxShad };
  bsc7?: { cs: IBoxShad };
  bsc8?: { cs: IBoxShad };
  bsc9?: { cs: IBoxShad };
  bsc10?: { cs: IBoxShad };
}

interface ItemInterface extends ICrProto {
  tsc?: Array<{ cs: ITextShad }>;
  tsc0?: { cs: ITextShad };
  tsc1?: { cs: ITextShad };
  tsc2?: { cs: ITextShad };
  tsc3?: { cs: ITextShad };
  tsc4?: { cs: ITextShad };
  tsc5?: { cs: ITextShad };
  tsc6?: { cs: ITextShad };
  tsc7?: { cs: ITextShad };
  tsc8?: { cs: ITextShad };
  tsc9?: { cs: ITextShad };
  tsc10?: { cs: ITextShad };
}

interface IContainer extends ICrProto  {
  c?: Array<IContainer>;
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

  i?: Array<ItemInterface>;
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
  c?: Array<IContainer>;
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
