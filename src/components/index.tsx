import * as React from 'react';
import { DynamicFeedIcon } from '../icons';

const cx = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ');

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary',
  icon?: React.ReactNode,
};

/** Figma component pgn.wgu-button: a pill with an optional trailing icon. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', icon, className, children, type = 'button', ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    className={cx('wgu-button', `wgu-button--${variant}`, className)}
    {...props}
  >
    <span>{children}</span>
    {icon}
  </button>
));
Button.displayName = 'Button';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string,
};

/** Figma component pgn.wgu-icon-button: 48px, labelled for screen readers. */
export function IconButton({
  label, className, children, type = 'button', ...props
}: IconButtonProps) {
  return (
    <button type={type} className={cx('wgu-icon-button', className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

type InteractiveHeaderProps = {
  name: string,
  icon?: React.ReactNode,
  variant?: 'plain' | 'chip',
};

/** The interactive's name, with its icon and a divider. */
export function InteractiveHeader({ name, icon = <DynamicFeedIcon />, variant = 'plain' }: InteractiveHeaderProps) {
  return (
    <div className={cx('wgu-interactive-header', variant === 'chip' && 'wgu-interactive-header--chip')}>
      {icon}
      <span className="wgu-interactive-header__divider" />
      <span className="wgu-interactive-header__name wgu-type-h6">{name}</span>
    </div>
  );
}

type LaunchCardProps = {
  name: string,
  title: string,
  body: string,
  actionLabel: string,
  onLaunch: () => void,
  /** Shown instead of launching, e.g. while the interactive has no content yet. */
  disabledReason?: string,
  imageUrl?: string,
  icon?: React.ReactNode,
  actionRef?: React.Ref<HTMLButtonElement>,
};

/** The "Launch Interactive" card that sits in the course page. */
export function LaunchCard({
  name, title, body, actionLabel, onLaunch, disabledReason, imageUrl, icon, actionRef,
}: LaunchCardProps) {
  return (
    <section className="wgu-launch" aria-label={name}>
      <div className="wgu-launch__panel">
        <div className="wgu-launch__content">
          <InteractiveHeader name={name} icon={icon} variant="chip" />
          <div className="wgu-launch__text">
            <h3 className="wgu-launch__title wgu-type-h5 wgu-clamp">{title}</h3>
            <p className="wgu-launch__body wgu-type-body-18-regular wgu-clamp">{body}</p>
          </div>
        </div>
        <div className="wgu-launch__action">
          {disabledReason && <p className="wgu-launch__note wgu-type-body-16-regular">{disabledReason}</p>}
          <Button ref={actionRef} onClick={onLaunch} disabled={Boolean(disabledReason)}>{actionLabel}</Button>
        </div>
      </div>
      {imageUrl && <div className="wgu-launch__media" style={{ backgroundImage: `url("${imageUrl}")` }} role="presentation" />}
    </section>
  );
}

type InteractiveShellProps = {
  name: string,
  icon?: React.ReactNode,
  actions?: React.ReactNode,
  children: React.ReactNode,
  className?: string,
  /** Plays the exit animation (see useOverlay's isClosing). */
  closing?: boolean,
};

/** The full-screen frame of an interactive: header with actions, then the body. */
export function InteractiveShell({
  name, icon, actions, children, className, closing,
}: InteractiveShellProps) {
  return (
    <div className={cx('wgu-shell', closing && 'is-closing', className)}>
      <div className="wgu-shell__header">
        <InteractiveHeader name={name} icon={icon} />
        <div className="wgu-shell__actions">{actions}</div>
      </div>
      <div className="wgu-shell__body">{children}</div>
    </div>
  );
}

type CardProps = React.HTMLAttributes<HTMLDivElement>;

/** Figma component pgn.wgu-course-card. */
export function Card({ className, ...props }: CardProps) {
  return <div className={cx('wgu-card', className)} {...props} />;
}
