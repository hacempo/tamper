// ==UserScript==
// @name         beautify
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  为指定网站调整页面布局
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
     * 全局网站开关
     * 每个网站的一个开关同时控制该站点的页面美化和屏蔽规则。
     * 未设置过的站点默认启用；在任意网站的油猴菜单中均可切换。
     */
    const SITE_CONFIGS = [
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

    const currentHostname = location.hostname.toLowerCase();

    /*
     * 各站点的基础布局样式集中存放，避免把大段 CSS 和注入流程混在条件分支中。
     * 少量新增/覆盖样式另放在 SITE_STYLE_RULES 中，以选择器和属性对象维护。
     */
    const SITE_STYLES = {
        zhihu: `
            /* =========================
               知乎
               ========================= */

            /* ---------- 问题页主栏 ---------- */

            /*
             * 问题页主容器。
             * 取消左右留白和列间距。
             */
            .Question-main {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                padding-left: 0 !important;
                padding-right: 0 !important;

                gap: 0 !important;
                column-gap: 0 !important;

                box-sizing: border-box !important;
            }

            /*
             * 问题页主栏。
             * 占满父容器剩余空间。
             */
            .Question-mainColumn {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                flex: 1 1 0% !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                padding-left: 0 !important;
                padding-right: 0 !important;

                box-sizing: border-box !important;
            }

            /*
             * 知乎问题页内部布局容器。
             */
            .css-1gl8cva {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                padding-left: 0 !important;
                padding-right: 0 !important;

                box-sizing: border-box !important;
            }


            /* ---------- 首页主栏 ---------- */

            .Topstory-container {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;

                padding-left: 0 !important;
                padding-right: 0 !important;
            }

            .Topstory-mainColumn {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                flex: 1 1 0% !important;

                margin-right: 0 !important;
            }

            .Topstory-mainColumnCard,
            .Topstory-content,
            .Topstory-recommend {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /* ---------- 顶栏 ---------- */

            /*
             * 顶栏 fixed 父容器。
             *
             * 根据 body 实际宽度动态设置，
             * 避免 100vw 包含滚动条区域导致溢出。
             */
            div:has(> header.AppHeader) {
                width: var(--beautify-content-width) !important;
                max-width: none !important;
                box-sizing: border-box !important;
            }


            /*
             * 顶栏本体。
             * 与主栏保持对齐。
             */
            header.AppHeader {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                box-sizing: border-box !important;
            }


            /* 顶栏第一层内部容器 */
            header.AppHeader > div {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /*
             * 顶栏中间区域：
             * 左边 Logo
             * 中间 导航 + 搜索
             * 右边 头像
             */
            header.AppHeader > div > .css-51utkw {
                flex: 1 1 0% !important;
                width: auto !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /* 中间区域内部内容容器 */
            header.AppHeader > div > .css-51utkw > .css-51utkw {
                flex: 1 1 auto !important;
                width: auto !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /* 原来的占位层 */
            header.AppHeader .css-1ndlr1n {
                max-width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /*
             * 搜索区域。
             * 占据导航与头像之间的剩余空间。
             */
            .css-x84wzl {
                min-width: 0 !important;
                max-width: 100% !important;
                flex: 1 1 0% !important;
                justify-content: center !important;
                box-sizing: border-box !important;
            }


            /*
             * 搜索框响应式宽度：
             * 最小 400px
             * 最大 540px
             */
            @media (min-width: 800px) {

                .css-x84wzl .SearchBar {
                    width: clamp(
                        400px,
                        52vw,
                        540px
                    ) !important;

                    max-width: 100% !important;

                    flex: 0 1 clamp(
                        400px,
                        52vw,
                        540px
                    ) !important;

                    box-sizing: border-box !important;
                }
            }


            /* SearchBar 内部表单填满 SearchBar */
            .css-x84wzl .SearchBar-tool {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }


            /* ---------- 回答页 QuestionHeader ---------- */

            .QuestionHeader {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;

                margin-left: 0 !important;
                margin-right: 0 !important;
            }

            .QuestionHeader-content {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;

                padding-left: 0 !important;
                padding-right: 0 !important;
            }

            /* ---------- 回答操作栏 ---------- */

            .ContentItem-actions > :nth-child(2) {
                margin-left: 0 !important;
            }

            /*
             * 修正操作栏左右负边距。
             * 原来 -20px，改为 -16px。
             */
            .ContentItem-actions {
                margin-left: -16px !important;
                margin-right: -16px !important;
            }


        `,
        tieba: `
            /* =========================
               百度贴吧
               ========================= */

            /*
             * 首页内容容器。
             * 默认左右各有 60px 内边距，会让中心栏无法利用完整主区域。
             */
            .home-page-wrapper > .container {
                padding-left: 0 !important;
                padding-right: 0 !important;
                box-sizing: border-box !important;
            }

            /* 首页主体：占满可用宽度，并保留右侧栏出现时的 flex 空间分配。 */
            .home-page-wrapper .center-content {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                flex: 1 1 0% !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                box-sizing: border-box !important;
            }

            /*
             * 主页和帖子详情页共用的主体布局修正。
             *
             * 折叠侧栏仍参与 flex 排版，占据 261px；主体通过
             * -261px 左外边距抵消占位，并以 100% 宽度铺满视口。
             * 同时将侧栏完全移出视口，避免其 z-index 覆盖主体
             * 左侧内容（原 left:-244px 会残留约 17px）。
             */
            .pc-main-page-layout .content-container:has(> .left-content.is-collapsed) {
                justify-content: flex-start !important;
            }

            .pc-main-page-layout .content-container:has(> .left-content.is-collapsed) > .left-content.is-collapsed {
                flex: 0 0 261px !important;
                width: 261px !important;
                left: -261px !important;
                box-sizing: border-box !important;
            }

            .pc-main-page-layout .content-container:has(> .left-content.is-collapsed) > .main-content.is-expanded {
                flex: 0 0 100% !important;
                width: 100% !important;
                margin-left: -261px !important;
                box-sizing: border-box !important;
            }

            /*
             * 帖子详情页外层容器。
             *
             * Tieba 默认 .container 有 1060px 的最大宽度，
             * 并带有左右自动外边距及额外内边距。
             * 这些限制会让 center-content 无法随外层主区域展开。
             */
            .pc-pb-box .container {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                padding-left: 0 !important;
                padding-right: 0 !important;

                box-sizing: border-box !important;
            }

            /*
             * 贴吧吧页禁止横向滚动。
             * .frs-page-wrap 是吧页的页面滚动容器，保留纵向滚动。
             */
            .frs-page-wrap {
                overflow-x: hidden !important;
            }

            .frs-page-wrap .frs-container {
                overflow-x: hidden !important;
            }

            /*
             * 贴吧吧页全宽布局。
             *
             * .frs-container 默认 max-width:1059px 且左右各有 60px padding，
             * 导致整个吧页内容被限制在中间。这里解除宽度和内边距限制，
             * 并让顶部头图区、下方主内容区同步铺满。
             */

            .frs-page-wrap .frs-container.frs-page-container {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                padding-left: 0 !important;
                padding-right: 0 !important;

                box-sizing: border-box !important;
            }

            .frs-page-wrap .frs-container .head-pic-area {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }

            .frs-page-wrap .frs-container .frs-main-container {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }

            /* 隐藏吧页右侧栏，让左侧帖子列表自然占满下方区域。 */
            .frs-page-wrap .frs-container .frs-main-container .frs-right-sidebar {
                display: none !important;
            }

            .frs-page-wrap .frs-container .frs-main-container .left-container {
                min-width: 0 !important;
                max-width: none !important;
                box-sizing: border-box !important;
            }

            /*
             * 帖子详情页禁止横向滚动。
             * .pc-pb-box 是实际发生 11px 内部溢出的滚动容器；
             * 只关闭横向溢出，保留原有纵向滚动。
             */
            .pc-pb-box {
                overflow-x: hidden !important;
            }

            /* 正文左右留出与主页相近的呼吸空间，避免文字和图片贴边。 */
            .pc-pb-box .center-content {
                padding-left: 12px !important;
                padding-right: 12px !important;
                box-sizing: border-box !important;
            }

            /*
             * 帖子详情页正文主栏。
             * 移除原有 47px 右边距，填满 .container 的可用宽度。
             */
            .pc-pb-box .center-content {
                width: 100% !important;
                max-width: none !important;
                min-width: 0 !important;

                flex: 1 1 0% !important;

                margin-left: 0 !important;
                margin-right: 0 !important;

                box-sizing: border-box !important;
            }
        `,
        bilibili: currentHostname === 't.bilibili.com'
            ? `
                /* =========================
                   哔哩哔哩动态页
                   ========================= */

                /* 主内容区铺满父容器；同时解除 flex/grid 的列宽限制 */
                main {
                    width: 100% !important;
                    max-width: none !important;
                    min-width: 0 !important;
                    flex: 1 1 100% !important;
                    grid-column: 1 / -1 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    box-sizing: border-box !important;
                }
            `
            : ''
    };

    const SITE_STYLE_RULES = {
        zhihu: [
            {
                description: '详情页问题栏宽度与左侧对齐',
                selectors: ['.QuestionHeader-main'],
                declarations: {
                    width: 'auto',
                    'padding-left': '0'
                }
            },
            {
                description: '知乎顶栏及悬浮顶栏靠左',
                selectors: ['.css-14iuq0r'],
                // max-width 不接受 auto；none 才表示取消最大宽度限制。
                declarations: { 'max-width': 'none' }
            },
            {
                selectors: ['.css-lgijre'],
                declarations: { padding: '0' }
            },
            {
                description: '隐藏知乎顶栏 Logo/名称区域',
                selectors: ['[aria-label="知乎"]'],
                declarations: { display: 'none' }
            },
            {
                description: '搜索框靠顶栏最右侧',
                selectors: ['.css-x84wzl'],
                declarations: { 'justify-content': 'flex-end' }
            }
        ],
        tieba: [
            {
                description: '贴吧顶栏搜索区靠左并去除顶栏内边距',
                selectors: ['.search-mid'],
                declarations: { margin: '0' }
            },
            {
                selectors: ['#top-bar'],
                declarations: { padding: '0' }
            }
        ]
    };

    const buildStyleRules = rules => rules.map(rule => {
        const description = rule.description
            ? `/* ${rule.description} */\n`
            : '';
        const selectors = rule.selectors.join(',\n');
        const declarations = Object.entries(rule.declarations)
            .map(([property, value]) => `    ${property}: ${value} !important;`)
            .join('\n');

        return `${description}${selectors} {\n${declarations}\n}`;
    }).join('\n\n');


    /*
     * 从 block.txt 迁移并持续维护的屏蔽规则。
     * enabled: false 表示仅保留记录，不会生成实际屏蔽 CSS。
     * 屏蔽规则与布局样式分开管理；实际注入仍受当前站点总开关控制。
     */
    const BLOCK_RULES = [
        {
            domains: ['tieba.baidu.com'],
            selectors: [
                '.home-left',
                '.right-menu',
                '.thread-action-area',
                '.pc-pb-first-floor-interactive',
                '.pc-pb-comments-desc',
                '.pc-pb-reply-box',
                '.right-nav-bar',
                '.frs-right-sidebar'
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
            selectors: [
                '.feature-float'
            ]
        },
        {
            domains: ['ngabbs.com'],
            selectors: [
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
                '.ContentItem-actions > :first-child',
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
                '.CornerButtonsGroup'
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
            // Bilibili 顶栏存在于所有 Bilibili 子域。
            domains: ['bilibili.com'],
            selectors: [
                '.left-entry-main > :nth-child(n+4)',
                '.right-entry__main > :not(:nth-child(n+4):nth-child(-n+6))'
            ]
        },
        {
            domains: ['t.bilibili.com'],
            selectors: [
                'aside',
                '.bili-dyn-publishing'
            ]
        },
        {
            // 仅记录，不应用：X 左栏与右栏。
            domains: ['x.com'],
            enabled: false,
            selectors: [
                'header',
                '[data-testid="sidebarColumn"]'
            ]
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

    const isDomainMatch = (hostname, domain) =>
        hostname === domain || hostname.endsWith('.' + domain);

    const currentSite = SITE_CONFIGS.find(site =>
        site.domains.some(domain => isDomainMatch(currentHostname, domain))
    );

    const isCurrentSiteEnabled = Boolean(
        currentSite && GM_getValue('beautify:enabled:' + currentSite.id, true)
    );

    // 提前创建主样式节点，避免等到脚本末尾才插入 style。
    const style = isCurrentSiteEnabled
        ? document.createElement('style')
        : null;

    if (style) style.id = 'beautify-style';

    for (const site of SITE_CONFIGS) {
        const storageKey = 'beautify:enabled:' + site.id;
        const isEnabled = GM_getValue(storageKey, true);

        GM_registerMenuCommand(
            (isEnabled ? '关闭' : '开启') + '「' + site.name + '」美化与屏蔽',
            () => {
                GM_setValue(storageKey, !isEnabled);
                location.reload();
            }
        );
    }

    /*
     * 以下选择器在原 block.txt 中已明确标记为“暂不启用”，
     * 因用途或影响范围尚未确认，迁移后继续保留为注释：
     *
     * tieba.baidu.com##.head-line
     * www.zhihu.com##.css-jghqwm
     * www.zhihu.com##.TopstoryItem:has(.ArticleItem)
     * www.zhihu.com##.TopstoryItem--advertCard
     */

    /*
     * 将样式节点尽早加入 document.head。
     * document-start 时 head 尚未创建的情况也会自动处理。
     */
    const installStyleElement = (styleElement) => {
        let observer;

        const install = () => {
            const target = document.head || document.documentElement;

            if (target && styleElement.parentNode !== target) {
                target.appendChild(styleElement);
            }

            if (document.head && observer) {
                observer.disconnect();
            }
        };

        if (!document.head) {
            observer = new MutationObserver(install);
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }

        install();
    };

    if (style) {
        installStyleElement(style);
    }

    const activeBlockSelectors = isCurrentSiteEnabled
        ? BLOCK_RULES
            .filter(rule => rule.enabled !== false && rule.domains.some(domain =>
                isDomainMatch(currentHostname, domain)
            ))
            .flatMap(rule => rule.selectors)
        : [];

    if (activeBlockSelectors.length > 0) {
        const blockStyle = document.createElement('style');
        blockStyle.id = 'beautify-block-style';
        blockStyle.textContent = activeBlockSelectors
            .map(selector => selector + ' {\n    display: none !important;\n}')
            .join('\n\n');

        installStyleElement(blockStyle);
    }

    /*
     * Bilibili 评论区使用 Shadow DOM。
     * 普通 document CSS 无法穿透，因此按实际 JS 路径处理：
     * #commentapp > bili-comments 的 shadowRoot
     *   ├─ #contents
     *   ├─ #feed > bili-comment-thread-renderer
     *   └─ #header > bili-comments-header-renderer 的 shadowRoot > #navbar
     */
    const installBilibiliShadowRules = () => {
        if (
            currentHostname !== 'www.bilibili.com' ||
            !GM_getValue('beautify:enabled:bilibili', true)
        ) return;

        let commentsRoot = null;
        let commentsObserver = null;
        let headerRoot = null;
        let applyScheduled = false;

        const nestedRootObservers = new Map();
        const pendingShadowHosts = new Set();
        const hiddenThreadOriginalDisplay = new WeakMap();

        const SHADOW_COMPONENTS = new Set([
            'bili-comments',
            'bili-comment-thread-renderer',
            'bili-comment-renderer',
            'bili-comment-replies-renderer',
            'bili-comment-reply-renderer',
            'bili-comments-header-renderer'
        ]);

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

        const hideShadowElement = (element) => {
            setImportantStyle(element, 'display', 'none');
        };

        const observeNestedRoot = (shadowRoot, isHeader = false) => {
            if (!shadowRoot) return;

            const existing = nestedRootObservers.get(shadowRoot);
            if (existing) return;

            const observer = new MutationObserver(scheduleApply);
            const options = {
                childList: true,
                subtree: true
            };

            if (isHeader) {
                // Header 中悬浮输入框可能通过 class/style 切换显示状态。
                options.attributes = true;
                options.attributeFilter = [
                    'class',
                    'style',
                    'hidden',
                    'aria-hidden'
                ];
            } else {
                // 评论内容只需关注新节点和商品标记属性变化。
                options.attributes = true;
                options.attributeFilter = ['data-type'];
            }

            observer.observe(shadowRoot, options);
            nestedRootObservers.set(shadowRoot, observer);
        };

        const setThreadHidden = (thread, hidden) => {
            if (hidden) {
                if (!hiddenThreadOriginalDisplay.has(thread)) {
                    hiddenThreadOriginalDisplay.set(thread, {
                        value: thread.style.getPropertyValue('display'),
                        priority: thread.style.getPropertyPriority('display')
                    });
                }

                setImportantStyle(thread, 'display', 'none');
                return;
            }

            const original = hiddenThreadOriginalDisplay.get(thread);
            if (!original) return;

            if (original.value) {
                thread.style.setProperty(
                    'display',
                    original.value,
                    original.priority
                );
            } else {
                thread.style.removeProperty('display');
            }

            hiddenThreadOriginalDisplay.delete(thread);
        };

        /*
         * 一次遍历完成三件事：
         * 1. 搜索商品标记（包括任意深度 Shadow DOM）；
         * 2. 隐藏一级评论和二级回复组件各自 ShadowRoot 中的 #footer；
         * 3. 发现尚未 attachShadow 的自定义组件，交给轻量轮询兜底。
         */
        const scanThread = (thread) => {
            let hasGoods = false;
            const visited = new Set();

            const walk = (node) => {
                if (!node || visited.has(node)) return;
                visited.add(node);

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;

                    if (element.matches('[data-type="goods"]')) {
                        hasGoods = true;
                    }

                    const tag = element.localName;

                    if (
                        tag === 'bili-comment-renderer' ||
                        tag === 'bili-comment-reply-renderer'
                    ) {
                        const commentRoot = element.shadowRoot;

                        if (commentRoot) {
                            observeNestedRoot(commentRoot);
                            hideShadowElement(commentRoot.querySelector('#footer'));
                        }
                    }

                    if (
                        tag &&
                        tag.startsWith('bili-') &&
                        SHADOW_COMPONENTS.has(tag) &&
                        !element.shadowRoot
                    ) {
                        pendingShadowHosts.add(element);
                    }

                    if (element.shadowRoot) {
                        observeNestedRoot(element.shadowRoot);
                        walk(element.shadowRoot);
                    }
                }

                for (const child of node.children || []) {
                    walk(child);
                }
            };

            walk(thread);
            setThreadHidden(thread, hasGoods);
        };

        const applyRules = () => {
            const commentsHost = document.querySelector(
                '#commentapp > bili-comments'
            );
            const root = commentsHost && commentsHost.shadowRoot;

            if (!root) {
                if (commentsHost) pendingShadowHosts.add(commentsHost);
                return;
            }

            if (root !== commentsRoot) {
                if (commentsObserver) commentsObserver.disconnect();

                commentsRoot = root;
                commentsObserver = new MutationObserver(scheduleApply);
                commentsObserver.observe(root, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['data-type']
                });
            }

            observeNestedRoot(root);

            const contents = root.querySelector('#contents');
            if (contents) {
                setImportantStyle(contents, 'padding-top', '0px');
            }

            const threads = root.querySelectorAll(
                '#feed > bili-comment-thread-renderer'
            );

            threads.forEach(scanThread);

            const headerHost = root.querySelector(
                '#header > bili-comments-header-renderer'
            );

            if (headerHost && !headerHost.shadowRoot) {
                pendingShadowHosts.add(headerHost);
            }

            const nextHeaderRoot = headerHost && headerHost.shadowRoot;

            if (nextHeaderRoot) {
                headerRoot = nextHeaderRoot;
                observeNestedRoot(headerRoot, true);

                const navbar = headerRoot.querySelector('#navbar');
                setImportantStyle(navbar, 'margin-bottom', '0px');

                // Header Shadow DOM 中的输入框和滚动后出现的悬浮输入框。
                hideShadowElement(headerRoot.querySelector('#commentbox'));
                hideShadowElement(
                    headerRoot.querySelector('.bili-comments-bottom-fixed-wrapper')
                );

                if (
                    headerHost.localName &&
                    !headerHost.shadowRoot
                ) {
                    pendingShadowHosts.add(headerHost);
                }
            }
        };

        // 新评论、展开回复、翻页和 Header 动态节点变化时重新扫描。
        const documentObserver = new MutationObserver(scheduleApply);
        documentObserver.observe(document, {
            childList: true,
            subtree: true
        });

        applyRules();

        /*
         * 不再每 1.2 秒完整遍历整个评论树。
         * 只检查此前见过、但当时尚未创建 ShadowRoot 的 bili-* 宿主节点。
         * 发现 ShadowRoot 后立即挂观察器并触发一次局部重扫。
         */
        const shadowRescanTimer = window.setInterval(() => {
            if (document.visibilityState !== 'visible') return;

            let discoveredRoot = false;

            for (const host of pendingShadowHosts) {
                if (!host.isConnected) {
                    pendingShadowHosts.delete(host);
                    continue;
                }

                if (host.shadowRoot) {
                    pendingShadowHosts.delete(host);
                    observeNestedRoot(
                        host.shadowRoot,
                        host.localName === 'bili-comments-header-renderer'
                    );
                    discoveredRoot = true;
                }
            }

            if (discoveredRoot) scheduleApply();
        }, 1000);

        window.addEventListener('pagehide', () => {
            window.clearInterval(shadowRescanTimer);
            documentObserver.disconnect();
            if (commentsObserver) commentsObserver.disconnect();

            for (const observer of nestedRootObservers.values()) {
                observer.disconnect();
            }
            nestedRootObservers.clear();
            pendingShadowHosts.clear();
        }, { once: true });

        if (window.customElements) {
            for (const name of SHADOW_COMPONENTS) {
                window.customElements.whenDefined(name).then(scheduleApply);
            }
        }
    };



    // 非目标网站只显示全局菜单，不注入任何 CSS。
    if (!currentSite) return;

    // 当前网站总开关关闭时，不注入任何页面美化样式。
    if (!isCurrentSiteEnabled) return;

    style.textContent = SITE_STYLES[currentSite.id] || '';

    const additionalStyleRules = SITE_STYLE_RULES[currentSite.id] || [];
    if (additionalStyleRules.length > 0) {
        style.textContent += '\n\n' + buildStyleRules(additionalStyleRules);
    }


    /* ---------- 普通页面样式已提前挂载，填充 CSS 后启动 B 站处理 ---------- */

    // 普通页面样式先完成注入，再启动 B 站评论 Shadow DOM 处理。
    installBilibiliShadowRules();


    /* ---------- 动态计算顶栏宽度 ---------- */

    if (currentSite.id === 'zhihu') {

        let bodyResizeObserver;

        const updateContentWidth = () => {
            const body = document.body;

            if (!body) return;

            const width = body.getBoundingClientRect().width;

            if (width <= 0) return;

            const value = `${width}px`;
            const rootStyle = document.documentElement.style;

            if (
                rootStyle.getPropertyValue('--beautify-content-width') !== value
            ) {
                rootStyle.setProperty('--beautify-content-width', value);
            }
        };

        const observeBody = () => {
            if (!document.body) return false;

            updateContentWidth();

            if (
                !bodyResizeObserver &&
                typeof ResizeObserver !== 'undefined'
            ) {
                bodyResizeObserver = new ResizeObserver(
                    updateContentWidth
                );

                bodyResizeObserver.observe(document.body);
            }

            return true;
        };

        // document-start 时 body 可能尚未创建
        if (!observeBody()) {
            const bodyObserver = new MutationObserver(() => {
                if (observeBody()) {
                    bodyObserver.disconnect();
                }
            });

            bodyObserver.observe(document.documentElement, {
                childList: true
            });
        }

        // 适应窗口缩放、旋转和视口变化
        window.addEventListener('resize', updateContentWidth, {
            passive: true
        });
    }

})();
