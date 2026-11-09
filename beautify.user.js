// ==UserScript==
// @name         Tablet Beautify
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  按网站独立开关的布局美化与广告屏蔽规则
// @match        *://tieba.baidu.com/*
// @match        *://115.com/*
// @match        *://*.115.com/*
// @match        *://115vod.com/*
// @match        *://*.115vod.com/*
// @match        *://ngabbs.com/*
// @match        *://*.ngabbs.com/*
// @match        *://yun.123pan.cn/*
// @match        *://www.zhihu.com/*
// @match        *://www.bilibili.com/*
// @match        *://x.com/*
// @match        *://*.x.com/*
// @match        *://douyin.com/*
// @match        *://*.douyin.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

/*
 * block.txt 注释原文归档
 * 以下为原广告屏蔽规则文件中所有 ! 注释，按原顺序保留。
 * 对应的启用规则已转换为下方各站点 CSS；标记为暂不启用的规则仍仅作记录。
 * ! ============================================================
 * ! 百度贴吧
 * ! ============================================================
 * ! 首页和详情页的顶栏
 * ! 顶栏的左栏
 * ! 顶栏的右栏
 * ! ===== 首页 =====
 * ! 首页帖子操作栏（点赞、分享及其他操作）
 * ! ===== 帖子详情页 =====
 * ! 帖子作者头像及用户信息栏
 * ! tieba.baidu.com##.head-line
 * ! 一楼操作栏（点赞、分享及其他操作）
 * ! 楼层评论/操作信息区域（点赞、分享及其他操作）
 * ! 回复输入栏
 * ! ===== 全站侧栏 =====
 * ! 贴吧右侧导航栏
 * ! 贴吧页右栏
 * ! ============================================================
 * ! 115 网盘
 * ! ============================================================
 * ! ===== 烦人：弹窗与浮动元素 =====
 * ! 页面底部左侧通知弹窗
 * ! 页面底部右侧浮动弹窗/功能浮层
 * ! ===== 无用：侧栏与导航入口 =====
 * ! 页面左侧栏
 * ! 顶栏备份/照片入口
 * ! 顶栏密档入口
 * ! 顶栏记事入口
 * ! ===== 烦人：顶部广告与提示 =====
 * ! 顶栏中间的广告/推广区域
 * ! 顶栏提示信息
 * ! ============================================================
 * ! 115 视频
 * ! ============================================================
 * ! 页面底部右侧浮动弹窗/功能浮层
 * ! ============================================================
 * ! NGA 玩家社区
 * ! ============================================================
 * ! ===== 主页主题列表 =====
 * ! 主题列表中的发帖人及发帖时间列
 * ! 主题列表中的最后回帖人及回帖时间列
 * ! ===== 主页与帖子详情页 =====
 * ! 通用 c1 信息列：主页的发帖/回帖人数；详情页的楼层用户信息
 * ! 主页和详情页中一组按钮/操作单元（搜索、发表新帖等）
 * ! ===== 顶部版头及发帖区域 =====
 * ! 顶部版头及相关信息模块容器（版头、版规、子版入口等）
 * ! 主页和帖子详情页的快速发帖区域
 * ! ============================================================
 * ! 123 云盘
 * ! ============================================================
 * ! ===== 烦人：广告与公告 =====
 * ! 页面底部右侧公告
 * ! 页面底部右侧广告（通常位于公告上方）
 * ! ===== 无用：顶部与侧栏 =====
 * ! 页面顶部整体区域
 * ! 页面左侧 aside 栏
 * ! 主界面内部的左侧菜单栏
 * ! ============================================================
 * ! 知乎
 * ! ============================================================
 * ! ===== 侧栏 =====
 * ! 首页及详情页通用侧栏
 * ! 详情页问题标题区域右侧栏，也用于浮动顶栏中的右侧区域
 * ! ===== 顶部导航（按从左到右的顺序） =====
 * ! 专栏广场入口
 * ! 圈子入口
 * ! 顶栏入口之间的分隔符
 * ! 项目广场 / AI Works 入口
 * ! 会员故事入口
 * ! AI 直答入口
 * ! 用户发布入口
 * ! 消息和私信入口
 * ! 顶栏最右侧头像/用户入口
 * ! ===== 问题和回答页面 =====
 * ! 问题标题区域底部操作模块（关注问题、写回答等）
 * ! 浮动顶栏问题区域中，面向答主显示的关注按钮
 * ! 回答区域中的赞赏按钮
 * ! 回答操作栏第一个按钮（赞同/反对）
 * ! 点赞按钮 .VoteButton 已被上一条操作栏首项规则覆盖，不重复添加
 * ! www.zhihu.com##.VoteButton
 * ! 回答操作栏的喜欢按钮
 * ! 回答操作栏的解释内容按钮
 * ! 回答的关注按钮
 * ! 评论的输入框
 * ! 评论的操作栏
 * ! ===== 首页及其他页面元素 =====
 * ! 首页写回答区域
 * ! 首页和详情页角落悬浮按钮组（AI 助手）
 * ! ============================================================
 * ! 哔哩哔哩
 * ! ============================================================
 * ! ===== 烦人：广告、直播及操作提示 =====
 * ! 广告屏蔽检测提示（隐藏页面内的检测提醒）
 * ! 首页轮播图
 * ! 页面初始加载时出现的推广/直播等卡片
 * ! 首次加载的 Feed 卡片：只隐藏不含“不感兴趣”标记的卡片
 * ! 页面滚动后新加载的 Feed 卡片：只隐藏不含“不感兴趣”标记的卡片
 * ! bilibili 视频页下的推广广告
 * ! bilibili 视频页右侧视频推荐中的广告
 * ! ============================================================
 * ! X
 * ! ============================================================
 * ! ===== 首页 =====
 * ! 首页时间线顶部的发帖栏
 * ! 每条帖子的操作栏
 * ! ============================================================
 * ! 抖音
 * ! ============================================================
 * ! 以下是评论区从上到下的元素
 * ! 评论的发布时间和发布地区
 * ! 评论区评论的操作栏
 * ! 评论区的输入框
 * ! ============================================================
 * ! 以下选择器用途尚未确认，暂不启用
 * ! 只保留记录；下面的规则均已注释，不会被过滤器执行
 * ! ============================================================
 * ! 知乎：css-jghqwm，元素用途及影响范围未确认
 * ! www.zhihu.com##.css-jghqwm
 * ! 知乎：首页文章类内容卡片，可能会误伤正常文章内容
 * ! www.zhihu.com##.TopstoryItem:has(.ArticleItem)
 * ! 知乎：首页推广卡片，具体是否仅匹配推广内容尚未确认
 * ! www.zhihu.com##.TopstoryItem--advertCard
 */


(function () {
    'use strict';

    /* ---------- 网站独立开关 ---------- */

    const hostname = location.hostname.toLowerCase();

    const SITE_CONFIGS = [
        { id: 'zhihu', name: '知乎', domains: ['www.zhihu.com'], includeSubdomains: false },
        { id: 'tieba', name: '百度贴吧', domains: ['tieba.baidu.com'], includeSubdomains: false },
        { id: '115', name: '115 网盘', domains: ['115.com'], includeSubdomains: true },
        { id: '115vod', name: '115 视频', domains: ['115vod.com'], includeSubdomains: true },
        { id: 'nga', name: 'NGA 玩家社区', domains: ['ngabbs.com'], includeSubdomains: true },
        { id: '123pan', name: '123 云盘', domains: ['yun.123pan.cn'], includeSubdomains: false },
        { id: 'bilibili', name: '哔哩哔哩', domains: ['www.bilibili.com'], includeSubdomains: false },
        { id: 'x', name: 'X', domains: ['x.com'], includeSubdomains: true },
        { id: 'douyin', name: '抖音', domains: ['douyin.com'], includeSubdomains: true }
    ];

    const site = SITE_CONFIGS.find(config =>
        config.domains.some(domain =>
            hostname === domain ||
            (config.includeSubdomains && hostname.endsWith('.' + domain))
        )
    );

    if (!site) return;

    const settingKey = 'site-rules-enabled:' + site.id;
    const isEnabled = GM_getValue(settingKey, true);

    GM_registerMenuCommand(
        (isEnabled ? '关闭' : '启用') + '「' + site.name + '」美化与屏蔽规则',
        () => {
            GM_setValue(settingKey, !GM_getValue(settingKey, true));
            location.reload();
        }
    );

    // 每个网站的状态分别保存；未设置过的站点默认启用。
    if (!isEnabled) return;

    /* ---------- 从 block.txt 合并的广告屏蔽规则 ---------- */

    const EXTRA_SITE_STYLES = {
        'tieba': `
            /* ============================================================
               百度贴吧
               ============================================================ */

            /* 首页和详情页的顶栏 */

            /* 顶栏的左栏 */
            .home-left {
                display: none !important;
            }

            /* 顶栏的右栏 */
            .right-menu {
                display: none !important;
            }

            /* ===== 首页 ===== */

            /* 首页帖子操作栏（点赞、分享及其他操作） */
            .thread-action-area {
                display: none !important;
            }


            /* ===== 帖子详情页 ===== */

            /* 帖子作者头像及用户信息栏：原规则暂不启用 */
            /* .head-line { display: none !important; } */

            /* 一楼操作栏（点赞、分享及其他操作） */
            .pc-pb-first-floor-interactive {
                display: none !important;
            }

            /* 楼层评论/操作信息区域（点赞、分享及其他操作） */
            .pc-pb-comments-desc {
                display: none !important;
            }

            /* 回复输入栏 */
            .pc-pb-reply-box {
                display: none !important;
            }


            /* ===== 全站侧栏 ===== */

            /* 贴吧右侧导航栏 */
            .right-nav-bar {
                display: none !important;
            }

            /* 贴吧页右栏 */
            .frs-right-sidebar {
                display: none !important;
            }
        `,

        'zhihu': `
            /* ============================================================
               知乎
               ============================================================ */

            /* ===== 侧栏 ===== */

            /* 首页及详情页通用侧栏 */
            .css-bkewaf {
                display: none !important;
            }

            /* 详情页问题标题区域右侧栏，也用于浮动顶栏中的右侧区域 */
            .QuestionHeader-side {
                display: none !important;
            }


            /* ===== 顶部导航（按从左到右的顺序） ===== */

            /* 专栏广场入口 */
            [href="https://www.zhihu.com/column-square"] {
                display: none !important;
            }

            /* 圈子入口 */
            [href="https://www.zhihu.com/ring-feeds"] {
                display: none !important;
            }

            /* 顶栏入口之间的分隔符 */
            .css-53paqb {
                display: none !important;
            }

            /* 项目广场 / AI Works 入口 */
            [href="https://www.zhihu.com/project-square"] {
                display: none !important;
            }

            /* 会员故事入口 */
            [href="https://www.zhihu.com/fiore/h5/vip-web"] {
                display: none !important;
            }

            /* AI 直答入口 */
            [href="https://zhida.zhihu.com/"] {
                display: none !important;
            }

            /* 用户发布入口 */
            .SearchBar-askContainer {
                display: none !important;
            }

            /* 消息和私信入口 */
            .css-1vbrp2j {
                display: none !important;
            }

            /* 顶栏最右侧头像/用户入口 */
            .css-ruapjk {
                display: none !important;
            }


            /* ===== 问题和回答页面 ===== */

            /* 问题标题区域底部操作模块（关注问题、写回答等） */
            .QuestionHeader-footer {
                display: none !important;
            }

            /* 浮动顶栏问题区域中，面向答主显示的关注按钮 */
            .FollowButton {
                display: none !important;
            }

            /* 回答区域中的赞赏按钮 */
            .Reward {
                display: none !important;
            }

            /* 回答操作栏第一个按钮（赞同/反对） */
            .ContentItem-actions > :first-child {
                display: none !important;
            }

            /* 点赞按钮 .VoteButton 已被上一条操作栏首项规则覆盖，不重复添加 */
            /* .VoteButton { display: none !important; } */

            /* 回答操作栏的喜欢按钮 */
            [aria-label="喜欢"] {
                display: none !important;
            }

            /* 回答操作栏的解释内容按钮 */
            [data-tooltip="解释这篇内容"] {
                display: none !important;
            }

            /* 回答的关注按钮 */
            .css-upmq18 {
                display: none !important;
            }

            /* 评论的输入框 */
            .css-1fo89v5 {
                display: none !important;
            }

            /* 评论的操作栏 */
            .css-140jo2 {
                display: none !important;
            }


            /* ===== 首页及其他页面元素 ===== */

            /* 首页写回答区域 */
            .WriteArea {
                display: none !important;
            }

            /* 首页和详情页角落悬浮按钮组（AI 助手） */
            .CornerButtonsGroup {
                display: none !important;
            }


            /* ===== 以下知乎规则用途尚未确认，暂不启用 ===== */

            /* 知乎：css-jghqwm，元素用途及影响范围未确认 */
            /* .css-jghqwm { display: none !important; } */

            /* 知乎：首页文章类内容卡片，可能会误伤正常文章内容 */
            /* .TopstoryItem:has(.ArticleItem) { display: none !important; } */

            /* 知乎：首页推广卡片，具体是否仅匹配推广内容尚未确认 */
            /* .TopstoryItem--advertCard { display: none !important; } */
        `,

        '115': `
            /* ============================================================
               115 网盘
               ============================================================ */

            /* ===== 烦人：弹窗与浮动元素 ===== */

            /* 页面底部左侧通知弹窗 */
            #js_bottom_notification {
                display: none !important;
            }

            /* 页面底部右侧浮动弹窗/功能浮层 */
            .feature-float {
                display: none !important;
            }


            /* ===== 无用：侧栏与导航入口 ===== */

            /* 页面左侧栏 */
            .container-leftside {
                display: none !important;
            }

            /* 顶栏备份/照片入口 */
            [data-nav="photo"] {
                display: none !important;
            }

            /* 顶栏密档入口 */
            [data-nav="credentials"] {
                display: none !important;
            }

            /* 顶栏记事入口 */
            [data-nav="note"] {
                display: none !important;
            }


            /* ===== 烦人：顶部广告与提示 ===== */

            /* 顶栏中间的广告/推广区域 */
            .ceiling-feature {
                display: none !important;
            }

            /* 顶栏提示信息 */
            .ceiling-link-temp {
                display: none !important;
            }
        `,

        '115vod': `
            /* ============================================================
               115 视频
               ============================================================ */

            /* 页面底部右侧浮动弹窗/功能浮层 */
            .feature-float {
                display: none !important;
            }
        `,

        'nga': `
            /* ============================================================
               NGA 玩家社区
               ============================================================ */

            /* ===== 主页主题列表 ===== */

            /* 主题列表中的发帖人及发帖时间列 */
            .topicrow .c3 {
                display: none !important;
            }

            /* 主题列表中的最后回帖人及回帖时间列 */
            .topicrow .c4 {
                display: none !important;
            }


            /* ===== 主页与帖子详情页 ===== */

            /* 通用 c1 信息列：主页的发帖/回帖人数；详情页的楼层用户信息 */
            .c1 {
                display: none !important;
            }

            /* 主页和详情页中一组按钮/操作单元（搜索、发表新帖等） */
            .cell {
                display: none !important;
            }


            /* ===== 顶部版头及发帖区域 ===== */

            /* 顶部版头及相关信息模块容器（版头、版规、子版入口等） */
            #toptopics {
                display: none !important;
            }

            /* 主页和帖子详情页的快速发帖区域 */
            #fast_post_c {
                display: none !important;
            }
        `,

        '123pan': `
            /* ============================================================
               123 云盘
               ============================================================ */

            /* ===== 烦人：广告与公告 ===== */

            /* 页面底部右侧公告 */
            .notice-box {
                display: none !important;
            }

            /* 页面底部右侧广告（通常位于公告上方） */
            .entry_p0tlq {
                display: none !important;
            }


            /* ===== 无用：顶部与侧栏 ===== */

            /* 页面顶部整体区域 */
            .mfy-main-layout__head {
                display: none !important;
            }

            /* 页面左侧 aside 栏 */
            aside {
                display: none !important;
            }

            /* 主界面内部的左侧菜单栏 */
            .withSideMenuLayoutSider_ELJ6a {
                display: none !important;
            }
        `,

        'bilibili': `
            /* ============================================================
               哔哩哔哩
               ============================================================ */

            /* ===== 烦人：广告、直播及操作提示 ===== */

            /* 广告屏蔽检测提示（隐藏页面内的检测提醒） */
            .adblock-tips {
                display: none !important;
            }

            /* 首页轮播图 */
            .recommended-swipe {
                display: none !important;
            }

            /* 页面初始加载时出现的推广/直播等卡片 */
            .floor-single-card {
                display: none !important;
            }

            /* 首次加载的 Feed 卡片：只隐藏不含“不感兴趣”标记的卡片 */
            .feed-card:not(:has(.enable-no-interest)) {
                display: none !important;
            }

            /* 页面滚动后新加载的 Feed 卡片：只隐藏不含“不感兴趣”标记的卡片 */
            .bili-feed-card:not(:has(.enable-no-interest)) {
                display: none !important;
            }

            /* bilibili 视频页下的推广广告 */
            .video-resource-list {
                display: none !important;
            }

            /* bilibili 视频页右侧视频推荐中的广告 */
            .video-page-special-card-small {
                display: none !important;
            }


            /* ===== 视频页新增屏蔽规则 ===== */

            /* bilibili 视频页的输入框 */
            #commentbox {
                display: none !important;
            }

            /* bilibili 视频页评论的操作栏 */
            #footer {
                display: none !important;
            }

            .bili-comments-bottom-fixed-wrapper {
                display: none !important;
            }


            /* ===== 顶栏新增屏蔽规则 ===== */

            /* 顶栏的左栏 */
            .left-entry-main > :nth-child(n+4) {
                display: none !important;
            }

            /* 顶栏的右栏 */
            .right-entry__main > :nth-child(2),
            .right-entry__main > :nth-child(3),
            .right-entry__main > :nth-child(7),
            .right-entry__main > :nth-child(8) {
                display: none !important;
            }


            /* ===== 视频页布局微调 ===== */

            /* div#contents 改为 padding-top: 0px */
            div#contents {
                padding-top: 0px !important;
            }

            /* #navbar 改为 margin-bottom: 0px */
            #navbar {
                margin-bottom: 0px !important;
            }
        `,

        'x': `
            /* ============================================================
               X
               ============================================================ */

            /* ===== 首页 ===== */

            /* 首页时间线顶部的发帖栏 */
            [aria-label="主页时间线"] > .r-184en5c {
                display: none !important;
            }

            /* 每条帖子的操作栏 */
            article .r-kzbkwu > :last-child {
                display: none !important;
            }
        `,

        'douyin': `
            /* ============================================================
               抖音
               ============================================================ */

            /* 以下是评论区从上到下的元素 */

            /* 评论的发布时间和发布地区 */
            .VAQA49VP {
                display: none !important;
            }

            /* 评论区评论的操作栏 */
            .Ctt1baq8 {
                display: none !important;
            }

            /* 评论区的输入框 */
            .comment-input-container {
                display: none !important;
            }
        `
    };


    const style = document.createElement('style');
    style.id = 'tablet-beautify-style';

    if (site.id === 'zhihu') {

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

    } else if (site.id === 'tieba') {

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
    }

    // 将当前网站的广告屏蔽 CSS 追加到原有布局美化 CSS。
    style.textContent += EXTRA_SITE_STYLES[site.id] || '';

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

    if (site.id === 'zhihu') {

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
