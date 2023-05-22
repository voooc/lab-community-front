import { withInstall } from '@/utils/index';
import Catalog from './src/MdCatalog.vue';
import Editor from './src/index.vue';
export const MdEditor = withInstall(Editor);
export const MdCatalog = withInstall(Catalog);
