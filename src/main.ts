import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import { setupGlobDirectives } from '@/directives';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupI18n } from '@/locales/setupI18n';

import { isDevMode } from './utils/env';

if (isDevMode()) {
    import('ant-design-vue/es/style');
}

async function bootstrap() {
    const app = createApp(App);

    // Configure store
    // 配置 store
    setupStore(app);

    // Register global components
    // 注册全局组件
    registerGlobComp(app);

    // Multilingual configuration
    // 多语言配置
    // Asynchronous case: language files may be obtained from the server side
    // 异步案例：语言文件可能从服务器端获取
    await setupI18n(app);

    // Configure routing
    // 配置路由
    setupRouter(app);

    // Register global directive
    // 注册全局指令
    setupGlobDirectives(app);
    app.mount('#app');
}

bootstrap();
