import 'styled-components';
import type { AppTheme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    readonly colors: AppTheme['colors'];
    readonly fonts: AppTheme['fonts'];
    readonly viewport: AppTheme['viewport'];
    readonly layout: AppTheme['layout'];
    readonly radius: AppTheme['radius'];
  }
}
