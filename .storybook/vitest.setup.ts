import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import * as previewAnnotations from './preview';

const project = setProjectAnnotations([previewAnnotations, a11yAddonAnnotations]);

beforeAll(project.beforeAll);
