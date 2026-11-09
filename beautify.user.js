// ==UserScript==
// @name         beautify
// @namespace    http://tampermonkey.net/
// @version      4.1
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
        { id: 'bilibili', name: '哔哩哔哩', hostname: 'www.bilibili.com' }
    ];

    const currentHostname = location.hostname.toLowerCase();

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
        currentHostname === site.hostname
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

        style.textContent = `
            /* =========================
               哔哩哔哩
               ========================= */

            /* 视频页内容区域顶部内边距归零 */
            div#contents {
                padding-top: 0px !important;
            }

            /* 导航栏底部外边距归零 */
            #navbar {
                margin-bottom: 0px !important;
            }
        `;
    }


    /* ---------- 尽早注入 CSS ---------- */

    let styleObserver;

    const installStyle = () => {
        const target = document.head || document.documentElement;

        if (target && style.parentNode !== target) {
            target.appendChild(style);
        }

        if (document.head && styleObserver) {
            styleObserver.disconnect();
        }
    };

    if (!document.head) {
        styleObserver = new MutationObserver(installStyle);

        styleObserver.observe(document, {
            childList: true,
            subtree: true
        });
    }

    installStyle();


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
