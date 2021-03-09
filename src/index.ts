import './index.scss';
import ThemeBuilder from './app/themeBuilder';

const themeBuilder = new ThemeBuilder();
window.onload = themeBuilder.start;
