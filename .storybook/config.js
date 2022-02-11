import { configure } from '@storybook/react';
import '@babel/polyfill';
import './styles.css';

const req = require.context('../src/js/', true, /\.story\.jsx$/);
const loadStories = () => req.keys().forEach(req);

configure(loadStories, module);