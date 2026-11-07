// ==UserScript==
// @name         Tablet Beautify
// @namespace    http://tampermonkey.net/
// @version      3.17
// @description  调整页面布局，让知乎和贴吧更适合平板竖屏
// @match        *://www.zhihu.com/*
// @match        *://tieba.baidu.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.id = 'tablet-beautify-style';

    if (location.hostname.includes('zhihu.com')) {

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
                width: var(--tb-content-width) !important;
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

    } else if (location.hostname.includes('tieba.baidu.com')) {

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

    if (location.hostname.includes('zhihu.com')) {

        let bodyResizeObserver;

        const updateContentWidth = () => {
            const body = document.body;

            if (!body) return;

            const width = body.getBoundingClientRect().width;

            if (width <= 0) return;

            const value = `${width}px`;
            const rootStyle = document.documentElement.style;

            if (
                rootStyle.getPropertyValue('--tb-content-width') !== value
            ) {
                rootStyle.setProperty('--tb-content-width', value);
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
