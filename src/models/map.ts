export type TPoint = {
  readonly lat: number;
  readonly lng: number;
  readonly assetName: string;
  readonly businessCategory: string;
  readonly riskRating: number;
  readonly riskFactors: {
    readonly [x: string]: number;
  };
  readonly year: number;
};
