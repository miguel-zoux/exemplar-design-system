import './fonts.scss';
import './styles.scss';

export * from './components';
export * from './icons';
export { useOverlay } from './hooks/useOverlay';
export {
  LAUNCH_PARAM, canCoverWindow, canUseLearningModal, closeLearningModal, isLaunchedInModal, launchUrl,
  onLearningModalClosed, openLearningModal,
} from './learningModal';
export { mountInShadow } from './shadow';

/** Put this class on the root element of every block that uses the design system. */
export const DESIGN_SYSTEM_CLASS = 'wgu-ds';
