// ==UserScript==
// @name         beautify
// @namespace    http://tampermonkey.net/
// @version      4.2
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
     * 无论当前打开哪个网站，油猴菜单都会显示以下全部开关。
     * 未设置过的站点默认启用；只控制对应站点的 CSS 美化。
     */
    const STYLE_SITES = [
        { id: 'zhihu', name: '知乎', hostname: 'www.zhihu.com' },
        { id: 'tieba', name: '百度贴吧', hostname: 'tieba.baidu.com' },
        { id: 'bilibili', name: '哔哩哔哩', hostnames: ['www.bilibili.com', 't.bilibili.com'] }
    ];

    const currentHostname = location.hostname.toLowerCase();

    /*
     * 从 block.txt 迁移的屏蔽规则。
     * 这些规则独立于站点美化开关，保持原过滤器的全站生效逻辑。
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
                '#fast_post_c'
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
                '.video-page-special-card-small',
                '#commentbox',
                '#footer',
                '.bili-comments-bottom-fixed-wrapper',
                '.left-entry-main > :nth-child(n+4)',
                '.right-entry__main > :nth-child(2), .right-entry__main > :nth-child(3), .right-entry__main > :nth-child(7), .right-entry__main > :nth-child(8)'
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
            domains: ['x.com'],
            selectors: [
                '[aria-label="主页时间线"] > .r-184en5c',
                'article .r-kzbkwu > :last-child'
            ]
        },
        {
            domains: ['douyin.com'],
            selectors: [
                '.VAQA49VP',
                '.Ctt1baq8',
                '.comment-input-container'
            ]
        }
    ];

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

    const activeBlockSelectors = BLOCK_RULES
        .filter(rule => rule.domains.some(domain =>
            currentHostname === domain || currentHostname.endsWith('.' + domain)
        ))
        .flatMap(rule => rule.selectors);

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
        if (currentHostname !== 'www.bilibili.com') return;

        const beautifyEnabled = GM_getValue('beautify:enabled:bilibili', true);

        let commentsRoot = null;
        let headerRoot = null;
        let commentsObserver = null;
        let headerObserver = null;

        const applyRules = () => {
            const commentsHost = document.querySelector('#commentapp > bili-comments');
            const root = commentsHost && commentsHost.shadowRoot;

            if (!root) return;

            if (root !== commentsRoot) {
                if (commentsObserver) commentsObserver.disconnect();

                commentsRoot = root;
                commentsObserver = new MutationObserver(applyRules);
                commentsObserver.observe(root, {
                    childList: true,
                    subtree: true
                });
            }

            // 评论区内容容器：原 #contents 规则位于 bili-comments 的 Shadow DOM 内。
            if (beautifyEnabled) {
                const contents = root.querySelector('#contents');
                if (contents) {
                    contents.style.setProperty('padding-top', '0px', 'important');
                }
            }

            // 仅隐藏包含商品标记的评论线程，不影响普通评论线程。
            const goodsThreads = root.querySelectorAll(
                '#feed > bili-comment-thread-renderer:has([data-type="goods"])'
            );

            goodsThreads.forEach(thread => {
                thread.style.setProperty('display', 'none', 'important');
            });

            // 导航栏位于 bili-comments-header-renderer 自己的 Shadow DOM 中。
            const headerHost = root.querySelector(
                '#header > bili-comments-header-renderer'
            );
            const nextHeaderRoot = headerHost && headerHost.shadowRoot;

            if (nextHeaderRoot) {
                if (nextHeaderRoot !== headerRoot) {
                    if (headerObserver) headerObserver.disconnect();

                    headerRoot = nextHeaderRoot;
                    headerObserver = new MutationObserver(applyRules);
                    headerObserver.observe(headerRoot, {
                        childList: true,
                        subtree: true
                    });
                }

                if (beautifyEnabled) {
                    const navbar = headerRoot.querySelector('#navbar');
                    if (navbar) {
                        navbar.style.setProperty('margin-bottom', '0px', 'important');
                    }
                }
            }
        };

        // 监听组件挂载、Shadow DOM 内部更新以及后续加载的评论线程。
        const documentObserver = new MutationObserver(applyRules);
        documentObserver.observe(document, {
            childList: true,
            subtree: true
        });

        applyRules();

        if (window.customElements) {
            window.customElements.whenDefined('bili-comments').then(applyRules);
            window.customElements
                .whenDefined('bili-comments-header-renderer')
                .then(applyRules);
        }
    };

    installBilibiliShadowRules();

    for (const site of STYLE_SITES) {
        const storageKey = 'beautify:enabled:' + site.id;
        const isEnabled = GM_getValue(storageKey, true);

        GM_registerMenuCommand(
            (isEnabled ? '关闭' : '开启') + '「' + site.name + '」美化',
            () => {
                GM_setValue(storageKey, !isEnabled);
                // 刷新当前页面以同步菜单状态；若当前页面属于该站点，样式也会立即切换。
                location.reload();
            }
        );
    }

    const currentSite = STYLE_SITES.find(site =>
        (site.hostnames || [site.hostname]).includes(currentHostname)
    );

    // 非目标网站只显示全局菜单，不注入任何 CSS。
    if (!currentSite) return;

    // 当前网站的美化开关关闭时，不注入样式。
    if (!GM_getValue('beautify:enabled:' + currentSite.id, true)) return;

    const style = document.createElement('style');
    style.id = 'beautify-style';

    if (currentSite.id === 'zhihu') {

        style.textContent = `
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


        `;

    } else if (currentSite.id === 'tieba') {

        style.textContent = `
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
        `;
    } else if (currentSite.id === 'bilibili') {

        if (currentHostname === 't.bilibili.com') {
            style.textContent = `
                /* =========================
                   哔哩哔哩动态页
                   ========================= */

                /* 主内容区铺满可用视口宽度 */
                main {
                    width: 100% !important;
                    max-width: none !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    box-sizing: border-box !important;
                }
            `;
        }
    }


    /* ---------- 尽早注入 CSS ---------- */

    if (style.textContent.trim()) {
        installStyleElement(style);
    }


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
