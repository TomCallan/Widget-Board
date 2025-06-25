import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ColorScheme } from '../types/widget';

export const useApplySettings = (scheme: ColorScheme) => {
  const { settings } = useSettings();

  // Apply performance settings
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--transition-duration',
      settings.performance.reduceMotion ? '0s' : '0.2s'
    );
    document.body.style.transform = settings.performance.hardwareAcceleration
      ? 'translateZ(0)'
      : 'none';
  }, [settings.performance]);

  // Apply appearance settings
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--widget-spacing',
      `${settings.appearance.widgetSpacing}px`
    );
  }, [settings.appearance.widgetSpacing]);

  // Apply general settings
  useEffect(() => {
    document.documentElement.classList.toggle(
      'disable-animations',
      !settings.general.enableAnimations
    );
  }, [settings.general.enableAnimations]);

  // Apply color scheme accent as CSS variables
  useEffect(() => {
    if (scheme && scheme.accent) {
      document.documentElement.style.setProperty('--accent-h', `${scheme.accent.h}`);
      document.documentElement.style.setProperty('--accent-s', `${scheme.accent.s}%`);
      document.documentElement.style.setProperty('--accent-l', `${scheme.accent.l}%`);
    }
  }, [scheme]);
}; 