declare module "react-simple-maps" {
  import { ComponentType, SVGProps, MouseEvent } from "react";

  interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (params: { geographies: Geography[]; projection: unknown }) => React.ReactNode;
    parseGeographies?: (features: unknown[]) => unknown[];
  }

  interface Geography {
    rsmKey: string;
    type: string;
    properties: Record<string, unknown>;
    geometry: object;
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const ZoomableGroup: ComponentType<{ children?: React.ReactNode; [key: string]: unknown }>;
  export const Marker: ComponentType<{ coordinates: [number, number]; children?: React.ReactNode; [key: string]: unknown }>;
}
