/**
 * src/pages/index.js - Barrel exports for page components
 */

export { LandingPage } from './LandingPage';
export { GamePage } from './GamePage';

export default {
  LandingPage: require('./LandingPage').LandingPage,
  GamePage: require('./GamePage').GamePage
};
