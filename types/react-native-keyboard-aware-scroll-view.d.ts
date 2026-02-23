declare module 'react-native-keyboard-aware-scroll-view' {
  import * as React from 'react';
  import { ScrollViewProps } from 'react-native';

  export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    enableOnAndroid?: boolean;
    extraHeight?: number;
    extraScrollHeight?: number;
    keyboardOpeningTime?: number;
    viewIsInsideTabBar?: boolean;
    enableAutomaticScroll?: boolean;
  }

  export class KeyboardAwareScrollView extends React.Component<KeyboardAwareScrollViewProps> {}
}
