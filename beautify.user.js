// ==UserScript==
// @name         beautify
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  为指定网站调整页面布局并屏蔽多余元素
// @match        *://*/*
// @run-at       document-start
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    /*
     * 站点列表。每个站点一个开关，同时控制该站点的样式和屏蔽规则。
     * 未设置过的站点默认启用；在油猴菜单中切换。
     */
    const SITES = [
        { id: 'tieba', name: '百度贴吧', domains: ['tieba.baidu.com'] },
        { id: '115', name: '115 网盘', domains: ['115.com'] },
        { id: '115vod', name: '115 视频', domains: ['115vod.com'] },
        { id: 'nga', name: 'NGA 玩家社区', domains: ['ngabbs.com'] },
        { id: '123pan', name: '123 云盘', domains: ['yun.123pan.cn'] },
        { id: 'zhihu', name: '知乎', domains: ['www.zhihu.com'] },
        { id: 'bilibili', name: '哔哩哔哩', domains: ['bilibili.com'] },
        { id: 'x', name: 'X', domains: ['x.com'] },
        { id: 'douyin', name: '抖音', domains: ['douyin.com'] }
    ];

    const hostname = location.hostname.toLowerCase();
    const pathname = location.pathname;

    const isDomainMatch = domain =>
        hostname === domain || hostname.endsWith('.' + domain);

    const matchesPath = paths =>
        paths.some(path => pathname === path || pathname.startsWith(path + '/'));

    /*
     * 规则是否对当前页面生效。可选字段：
     *   enabled: false      仅保留记录，不生效
     *   domains             限定域名（含子域）
     *   onlyPaths           仅这些路径生效
     *   excludePaths        这些路径不生效
     */
    const isRuleActive = rule =>
        rule.enabled !== false &&
        (!rule.domains || rule.domains.some(isDomainMatch)) &&
        (!rule.onlyPaths || matchesPath(rule.onlyPaths)) &&
        !(rule.excludePaths && matchesPath(rule.excludePaths));

    const enabledKey = id => 'beautify:enabled:' + id;

    for (const site of SITES) {
        const isEnabled = GM_getValue(enabledKey(site.id), true);

        GM_registerMenuCommand(
            (isEnabled ? '关闭' : '开启') + '「' + site.name + '」美化与屏蔽',
            () => {
                GM_setValue(enabledKey(site.id), !isEnabled);
                location.reload();
            }
        );
    }

    const currentSite = SITES.find(site => site.domains.some(isDomainMatch));

    // 非目标网站、或该站点开关已关闭：不注入任何东西。
    if (!currentSite || !GM_getValue(enabledKey(currentSite.id), true)) return;


    /* =====================================================================
     * 样式规则
     * 格式：{ selectors, declarations, media?, domains?, onlyPaths?, excludePaths? }
     * 所有声明自动加 !important；max-width 要取消限制用 none（auto 无效）。
     * ===================================================================== */

    const FILL = {
        width: '100%',
        'max-width': 'none',
        'min-width': '0',
        'box-sizing': 'border-box'
    };
    const NO_SIDE_MARGIN = { 'margin-left': '0', 'margin-right': '0' };
    const NO_SIDE_PADDING = { 'padding-left': '0', 'padding-right': '0' };

    const STYLE_RULES = {
        // 移动端网页。桌面端规则已归档到仓库的 style.txt。
        tieba: [
            {
                // 主页及页面主体取消宽度上限，顶部固定导航栏同理。
                selectors: ['.main-page-wrap', '.nav-bar-v2-fixed'],
                declarations: { 'max-width': 'none' }
            }
        ],

        zhihu: [
            // ---------- 问题页主栏 ----------
            {
                selectors: ['.Question-main', '.Question-mainColumn', '.css-1gl8cva'],
                declarations: { ...FILL, ...NO_SIDE_MARGIN, ...NO_SIDE_PADDING }
            },
            {
                selectors: ['.Question-main'],
                declarations: { gap: '0', 'column-gap': '0' }
            },
            {
                selectors: ['.Question-mainColumn'],
                declarations: { flex: '1 1 0%' }
            },

            // ---------- 首页主栏 ----------
            {
                selectors: ['.Topstory-container'],
                declarations: { ...FILL, ...NO_SIDE_PADDING }
            },
            {
                selectors: ['.Topstory-mainColumn'],
                declarations: {
                    width: '100%',
                    'max-width': 'none',
                    'min-width': '0',
                    flex: '1 1 0%',
                    'margin-right': '0'
                }
            },
            {
                selectors: [
                    '.Topstory-mainColumnCard',
                    '.Topstory-content',
                    '.Topstory-recommend'
                ],
                declarations: FILL
            },

            // ---------- 顶栏 ----------
            {
                // fixed 父容器：宽度由下方脚本按 body 实际宽度写入，
                // 避免 100vw 包含滚动条导致溢出。
                selectors: ['div:has(> header.AppHeader)'],
                declarations: {
                    width: 'var(--beautify-content-width)',
                    'max-width': 'none',
                    'box-sizing': 'border-box'
                }
            },
            {
                selectors: ['header.AppHeader'],
                declarations: { ...FILL, ...NO_SIDE_MARGIN }
            },
            {
                selectors: ['header.AppHeader > div'],
                declarations: { ...FILL, 'max-width': '100%' }
            },
            {
                // 顶栏中间区域：导航 + 搜索
                selectors: ['header.AppHeader > div > .css-51utkw'],
                declarations: { ...FILL, width: 'auto', flex: '1 1 0%' }
            },
            {
                selectors: ['header.AppHeader > div > .css-51utkw > .css-51utkw'],
                declarations: { ...FILL, width: 'auto', flex: '1 1 auto' }
            },
            {
                selectors: ['header.AppHeader .css-1ndlr1n'],
                declarations: {
                    'max-width': '100%',
                    'min-width': '0',
                    'box-sizing': 'border-box'
                }
            },
            {
                // 搜索区占据导航与头像之间的剩余空间，搜索框靠最右。
                selectors: ['.css-x84wzl'],
                declarations: {
                    'min-width': '0',
                    'max-width': '100%',
                    flex: '1 1 0%',
                    'justify-content': 'flex-end',
                    'box-sizing': 'border-box'
                }
            },
            {
                // 搜索框响应式宽度：400px ~ 540px
                media: '(min-width: 800px)',
                selectors: ['.css-x84wzl .SearchBar'],
                declarations: {
                    width: 'clamp(400px, 52vw, 540px)',
                    'max-width': '100%',
                    flex: '0 1 clamp(400px, 52vw, 540px)',
                    'box-sizing': 'border-box'
                }
            },
            {
                selectors: ['.css-x84wzl .SearchBar-tool'],
                declarations: { ...FILL, 'max-width': '100%' }
            },
            {
                // 顶栏及悬浮顶栏靠左
                selectors: ['.css-14iuq0r'],
                declarations: { 'max-width': 'none' }
            },

            // ---------- 回答页 QuestionHeader ----------
            {
                selectors: ['.QuestionHeader'],
                declarations: { ...FILL, ...NO_SIDE_MARGIN }
            },
            {
                selectors: ['.QuestionHeader-content'],
                declarations: { ...FILL, ...NO_SIDE_PADDING }
            },
            {
                selectors: ['.QuestionHeader-main'],
                declarations: { width: '100%' }
            },

            // ---------- 操作栏间距（搜索页与非搜索页 DOM 不同） ----------
            {
                excludePaths: ['/search'],
                selectors: ['.ContentItem-actions > :nth-child(2)'],
                declarations: { 'margin-left': '0' }
            },
            {
                excludePaths: ['/search'],
                selectors: ['.ContentItem-actions'],
                declarations: { 'margin-left': '-16px', 'margin-right': '-16px' }
            },
            {
                onlyPaths: ['/search'],
                selectors: ['.css-1qqx3d0 > :nth-child(2)'],
                declarations: { 'margin-left': '0' }
            },
            {
                onlyPaths: ['/search'],
                selectors: ['.css-1qqx3d0'],
                declarations: { 'margin-left': '-16px', 'margin-right': '-16px' }
            },

            // ---------- 搜索页 ----------
            {
                onlyPaths: ['/search'],
                selectors: ['.Search-container'],
                declarations: { padding: '0', width: '100%' }
            },
            {
                onlyPaths: ['/search'],
                selectors: ['#SearchMain'],
                declarations: { 'margin-right': '0', width: '100%' }
            },
            {
                // 顶栏容器占满宽度并取消居中外边距
                onlyPaths: ['/search'],
                selectors: ['.SearchTabs-inner'],
                declarations: {
                    display: 'flex',
                    margin: '0',
                    width: '100%',
                    'max-width': 'none',
                    'align-items': 'center'
                }
            },
            {
                onlyPaths: ['/search'],
                selectors: ['.SearchTabs-searchBarContainer'],
                declarations: { 'margin-left': 'auto', flex: '0 0 auto' }
            }
        ],

        bilibili: [
            {
                // 动态页主内容区铺满父容器，并解除 flex/grid 列宽限制
                domains: ['t.bilibili.com'],
                selectors: ['main'],
                declarations: {
                    ...FILL,
                    ...NO_SIDE_MARGIN,
                    flex: '1 1 100%',
                    'grid-column': '1 / -1'
                }
            }
        ]
    };

    /*
     * 屏蔽规则（display: none）。
     * 按域名（含子域）匹配；每个选择器单独成条，避免其中一条不被支持时连累其他。
     * enabled: false 表示仅保留记录。
     *
     * 贴吧桌面端规则已归档到仓库的 block.txt。
     * 其他暂不启用的选择器（用途待确认）：
     *   www.zhihu.com: .css-jghqwm、.TopstoryItem:has(.ArticleItem)、.TopstoryItem--advertCard
     */
    const BLOCK_RULES = [
        {
            // 移动端网页
            domains: ['tieba.baidu.com'],
            selectors: [
                '.login',           // 帖子底部浮动操作栏（收藏/回复/点赞）及回帖旁点赞
                '.icon_tshows',     // 楼主姓名旁图标
                '.level-icon',      // 回帖用户姓名旁图标
                '.interaction-bar'  // 主页操作栏
            ]
        },
        {
            domains: ['115.com'],
            selectors: [
                '#js_bottom_notification',
                '.feature-float',
                '.container-leftside',
                '[data-nav="photo"]',
                '[data-nav="credentials"]',
                '[data-nav="note"]',
                '.ceiling-feature',
                '.ceiling-link-temp'
            ]
        },
        {
            domains: ['115vod.com'],
            selectors: ['.feature-float']
        },
        {
            domains: ['ngabbs.com'],
            selectors: [
                // 帖子列表每行的元信息条（回复数/发帖人/时间等）。
                // 屏蔽后行高由 123px 降到 64px，一屏能看到约两倍的帖子。
                // .posterInfoLineB 是同一模板的另一种命名。
                '.posterInfoLine',
                '.posterInfoLineB',
                '.topicrow .c3',
                '.topicrow .c4',
                '.c1',
                '.cell',
                '#toptopics',
                '#fast_post_c',
                '#footer',
                '#b_nav',
                '#m_nav',
                '#m_pbtntop',
                '#mainmenu',
                '#custombg'
            ]
        },
        {
            domains: ['yun.123pan.cn'],
            selectors: [
                '.notice-box',
                '.entry_p0tlq',
                '.mfy-main-layout__head',
                'aside',
                '.withSideMenuLayoutSider_ELJ6a'
            ]
        },
        {
            domains: ['www.zhihu.com'],
            selectors: [
                '.css-bkewaf',
                '.QuestionHeader-side',
                '[href="https://www.zhihu.com/column-square"]',
                '[href="https://www.zhihu.com/ring-feeds"]',
                '.css-53paqb',
                '[href="https://www.zhihu.com/project-square"]',
                '[href="https://www.zhihu.com/fiore/h5/vip-web"]',
                '[href="https://zhida.zhihu.com/"]',
                '.SearchBar-askContainer',
                '.css-1vbrp2j',
                '.css-ruapjk',
                '.QuestionHeader-footer',
                '.FollowButton',
                '.Reward',
                '.css-a3pqj1',
                '.ContentItem-time',
                '.css-dvccr2',
                '.css-kt4t4n',
                '[aria-label="喜欢"]',
                '[data-tooltip="解释这篇内容"]',
                '.css-upmq18',
                '.css-1fo89v5',
                '.css-140jo2',
                '.WriteArea',
                '.CornerButtonsGroup',
                '[aria-label="知乎"]'   // 顶栏 Logo/名称区域
            ]
        },
        {
            domains: ['www.zhihu.com'],
            excludePaths: ['/search'],
            selectors: ['.ContentItem-actions > :first-child']
        },
        {
            // 搜索页使用新版 DOM 选择器，等价替换上一条。
            domains: ['www.zhihu.com'],
            onlyPaths: ['/search'],
            selectors: [
                '.css-1qqx3d0 > :first-child',
                '.css-1m4ta6s',
                '.SearchTabs-profile'
            ]
        },
        {
            domains: ['www.bilibili.com'],
            selectors: [
                '.adblock-tips',
                '.recommended-swipe',
                '.floor-single-card',
                '.feed-card:not(:has(.enable-no-interest))',
                '.bili-feed-card:not(:has(.enable-no-interest))',
                '.video-resource-list',
                '.video-page-special-card-small'
            ]
        },
        {
            // 顶栏存在于所有 Bilibili 子域。
            domains: ['bilibili.com'],
            selectors: [
                '.left-entry-main > :nth-child(n+4)',
                '.right-entry__main > :not(:nth-child(n+4):nth-child(-n+6))'
            ]
        },
        {
            domains: ['t.bilibili.com'],
            selectors: ['aside', '.bili-dyn-publishing']
        },
        {
            // 仅记录，不应用：X 左栏与右栏。
            domains: ['x.com'],
            enabled: false,
            selectors: ['header', '[data-testid="sidebarColumn"]']
        },
        {
            domains: ['x.com'],
            selectors: [
                '[data-testid="inline_reply_offscreen"]',
                '.r-rull8r',
                '[aria-label="主页时间线"] > .r-184en5c',
                'article .r-kzbkwu > :last-child'
            ]
        },
        {
            domains: ['douyin.com'],
            selectors: [
                '.VAQA49VP',
                '.Ctt1baq8',
                '.comment-input-container',
                '.semiTabrelated_card',
                '.semiTabai_card'
            ]
        }
    ];


    /* =====================================================================
     * 生成并注入 CSS（样式在前、屏蔽在后，屏蔽优先）
     * ===================================================================== */

    const buildStyleRule = rule => {
        const declarations = Object.entries(rule.declarations)
            .map(([property, value]) => `    ${property}: ${value} !important;`)
            .join('\n');
        const body = `${rule.selectors.join(',\n')} {\n${declarations}\n}`;

        return rule.media ? `@media ${rule.media} {\n${body}\n}` : body;
    };

    const styleCss = (STYLE_RULES[currentSite.id] || [])
        .filter(isRuleActive)
        .map(buildStyleRule);

    const blockCss = BLOCK_RULES
        .filter(isRuleActive)
        .flatMap(rule => rule.selectors)
        .map(selector => `${selector} {\n    display: none !important;\n}`);

    const mountStyle = css => {
        const style = document.createElement('style');
        style.id = 'beautify-style';
        style.textContent = css;

        // document-start 时 head 可能还不存在：先挂到 documentElement，
        // 等 head 出现后再移进去。
        const attach = () => {
            const target = document.head || document.documentElement;

            if (target && style.parentNode !== target) target.appendChild(style);

            return Boolean(document.head);
        };

        if (!attach()) {
            const observer = new MutationObserver(() => {
                if (attach()) observer.disconnect();
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    };

    const allCss = [...styleCss, ...blockCss].join('\n\n');
    if (allCss) mountStyle(allCss);


    /* =====================================================================
     * 知乎：按 body 实际宽度动态设置顶栏宽度变量 --beautify-content-width
     * ===================================================================== */

    const watchZhihuContentWidth = () => {
        const update = () => {
            const width = document.body.getBoundingClientRect().width;

            if (width > 0) {
                document.documentElement.style.setProperty(
                    '--beautify-content-width',
                    width + 'px'
                );
            }
        };

        const start = () => new ResizeObserver(update).observe(document.body);

        // document-start 时 body 可能尚未创建
        if (document.body) {
            start();
            return;
        }

        const observer = new MutationObserver(() => {
            if (!document.body) return;
            observer.disconnect();
            start();
        });
        observer.observe(document.documentElement, { childList: true });
    };

    if (currentSite.id === 'zhihu') watchZhihuContentWidth();


    /* =====================================================================
     * Bilibili 评论区（Shadow DOM，普通 CSS 无法穿透，只能用 JS 处理）
     *
     * #commentapp > bili-comments 的 shadowRoot
     *   ├─ #contents
     *   ├─ #feed > bili-comment-thread-renderer
     *   └─ #header > bili-comments-header-renderer 的 shadowRoot
     *        └─ #navbar、#commentbox、悬浮输入框
     * ===================================================================== */

    const installBilibiliShadowRules = () => {
        if (hostname !== 'www.bilibili.com') return;

        const SHADOW_COMPONENTS = new Set([
            'bili-comments',
            'bili-comment-thread-renderer',
            'bili-comment-renderer',
            'bili-comment-replies-renderer',
            'bili-comment-reply-renderer',
            'bili-comments-header-renderer'
        ]);

        const rootObservers = new Map();       // shadowRoot -> MutationObserver
        const pendingHosts = new Set();        // 已发现但尚未 attachShadow 的宿主
        const threadOriginalDisplay = new WeakMap();
        let applyScheduled = false;

        const scheduleApply = () => {
            if (applyScheduled) return;
            applyScheduled = true;

            queueMicrotask(() => {
                applyScheduled = false;
                applyRules();
            });
        };

        const setImportantStyle = (element, property, value) => {
            if (!element) return;

            if (
                element.style.getPropertyValue(property) !== value ||
                element.style.getPropertyPriority(property) !== 'important'
            ) {
                element.style.setProperty(property, value, 'important');
            }
        };

        const hide = element => setImportantStyle(element, 'display', 'none');

        const observeRoot = (shadowRoot, isHeader = false) => {
            if (rootObservers.has(shadowRoot)) return;

            const observer = new MutationObserver(scheduleApply);

            observer.observe(shadowRoot, {
                childList: true,
                subtree: true,
                attributes: true,
                // Header 的悬浮输入框通过 class/style 切换显示；
                // 评论内容只需关注商品标记。
                attributeFilter: isHeader
                    ? ['class', 'style', 'hidden', 'aria-hidden']
                    : ['data-type']
            });
            rootObservers.set(shadowRoot, observer);
        };

        const setThreadHidden = (thread, hidden) => {
            if (hidden) {
                if (!threadOriginalDisplay.has(thread)) {
                    threadOriginalDisplay.set(thread, {
                        value: thread.style.getPropertyValue('display'),
                        priority: thread.style.getPropertyPriority('display')
                    });
                }
                setImportantStyle(thread, 'display', 'none');
                return;
            }

            const original = threadOriginalDisplay.get(thread);
            if (!original) return;

            if (original.value) {
                thread.style.setProperty('display', original.value, original.priority);
            } else {
                thread.style.removeProperty('display');
            }
            threadOriginalDisplay.delete(thread);
        };

        /*
         * 遍历一条评论（含任意深度 Shadow DOM）：
         * 1. 查找商品标记，有则隐藏整条评论；
         * 2. 隐藏每条评论/回复内的 #footer；
         * 3. 记录尚未 attachShadow 的组件，交给定时器兜底。
         */
        const scanThread = thread => {
            let hasGoods = false;

            const walk = node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('[data-type="goods"]')) hasGoods = true;

                    const tag = node.localName;
                    const shadowRoot = node.shadowRoot;

                    if (shadowRoot) {
                        observeRoot(shadowRoot);

                        if (
                            tag === 'bili-comment-renderer' ||
                            tag === 'bili-comment-reply-renderer'
                        ) {
                            hide(shadowRoot.querySelector('#footer'));
                        }

                        walk(shadowRoot);
                    } else if (SHADOW_COMPONENTS.has(tag)) {
                        pendingHosts.add(node);
                    }
                }

                for (const child of node.children || []) walk(child);
            };

            walk(thread);
            setThreadHidden(thread, hasGoods);
        };

        const applyRules = () => {
            const commentsHost = document.querySelector('#commentapp > bili-comments');
            const root = commentsHost && commentsHost.shadowRoot;

            if (!root) {
                if (commentsHost) pendingHosts.add(commentsHost);
                return;
            }

            observeRoot(root);

            setImportantStyle(root.querySelector('#contents'), 'padding-top', '0px');

            root.querySelectorAll('#feed > bili-comment-thread-renderer')
                .forEach(scanThread);

            const headerHost = root.querySelector('#header > bili-comments-header-renderer');
            const headerRoot = headerHost && headerHost.shadowRoot;

            if (headerHost && !headerRoot) {
                pendingHosts.add(headerHost);
                return;
            }

            if (headerRoot) {
                observeRoot(headerRoot, true);

                setImportantStyle(headerRoot.querySelector('#navbar'), 'margin-bottom', '0px');
                // 输入框以及滚动后出现的悬浮输入框
                hide(headerRoot.querySelector('#commentbox'));
                hide(headerRoot.querySelector('.bili-comments-bottom-fixed-wrapper'));
            }
        };

        // 新评论、展开回复、翻页、Header 动态节点变化时重新扫描。
        const documentObserver = new MutationObserver(scheduleApply);
        documentObserver.observe(document, { childList: true, subtree: true });

        applyRules();

        // 只检查此前见过、但当时尚未创建 ShadowRoot 的宿主节点。
        const pendingTimer = window.setInterval(() => {
            if (document.visibilityState !== 'visible') return;

            let found = false;

            for (const host of pendingHosts) {
                if (!host.isConnected) {
                    pendingHosts.delete(host);
                } else if (host.shadowRoot) {
                    pendingHosts.delete(host);
                    observeRoot(
                        host.shadowRoot,
                        host.localName === 'bili-comments-header-renderer'
                    );
                    found = true;
                }
            }

            if (found) scheduleApply();
        }, 1000);

        window.addEventListener('pagehide', () => {
            window.clearInterval(pendingTimer);
            documentObserver.disconnect();
            rootObservers.forEach(observer => observer.disconnect());
            rootObservers.clear();
            pendingHosts.clear();
        }, { once: true });

        for (const name of SHADOW_COMPONENTS) {
            window.customElements.whenDefined(name).then(scheduleApply);
        }
    };

    if (currentSite.id === 'bilibili') installBilibiliShadowRules();
})();
