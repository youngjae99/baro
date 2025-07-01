declare module 'react-native-arkit' {
  import {Component} from 'react';
  import {ViewStyle} from 'react-native';

  export interface ARKitProps {
    style?: ViewStyle;
    debug?: boolean;
    planeDetection?: string;
    lightEstimationEnabled?: boolean;
    children?: React.ReactNode;
  }

  export class ARKit extends Component<ARKitProps> {
    static ARPlaneDetection: {
      Horizontal: string;
      Vertical: string;
      HorizontalAndVertical: string;
    };
  }
}
