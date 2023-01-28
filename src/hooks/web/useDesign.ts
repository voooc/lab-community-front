import { useAppProviderContext } from '@/hooks/web/useAppContext';
import { prefixCls } from '@/hooks/setting';

export function useDesign(scope: string) {
    const values = useAppProviderContext();
    return {
        prefixCls: `${prefixCls}-${scope}`,
        prefixVar: values.prefixCls,
    };
}
