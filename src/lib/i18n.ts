export const languages = ['en', 'zh'] as const;
export type Lang = (typeof languages)[number];

export const htmlLang: Record<Lang, string> = { en: 'en', zh: 'zh-CN' };

const strings = {
  en: {
    home: 'About',
    publications: 'Publications',
    cv: 'CV',
    life: 'Life',
    switchTo: '中文',
    switchLabel: 'Switch to Chinese',
    toggleMode: 'Switch between dark and light',
    researchInterests: 'Research interests',
    selectedPublications: 'Selected publications',
    allPublications: 'All publications',
    journalArticles: 'Journal articles',
    inPress: 'In press',
    accepted: 'Conditionally accepted',
    underReview: 'Under review',
    workingPapers: 'Working papers',
    presentations: 'Conference presentations',
    paper: 'Paper',
    pdf: 'PDF',
    abstract: 'Abstract',
    cite: 'Cite',
    copy: 'Copy',
    copied: 'Copied',
    keywords: 'Keywords',
    correspondingNote: '# Corresponding author',
    downloadCv: 'Download CV (PDF)',
    travel: 'Travel',
    shows: 'Shows',
    travelIntro: 'Places, fragments, and moving memories.',
    showsIntro: 'Concerts, stages, voices, and nights.',
    places: 'places',
    nights: 'shows',
    close: 'Close',
    onThisPage: 'On this page',
    scrollDown: 'Scroll to About',
    enlargeFigure: 'Enlarge figure',
    lastUpdated: 'Last updated',
    notFound: 'Page not found',
    notFoundBody: 'The page you were looking for has moved or no longer exists.',
    backHome: 'Back to the home page',
    email: 'Email',
    invited: 'Invited talk',
    poster: 'Poster',
    panel: 'Panel',
    presentation: 'Presentation',
  },
  zh: {
    home: '关于',
    publications: '研究成果',
    cv: '简历',
    life: '生活',
    switchTo: 'EN',
    switchLabel: '切换到英文',
    toggleMode: '切换深色 / 浅色',
    researchInterests: '研究兴趣',
    selectedPublications: '代表性成果',
    allPublications: '全部成果',
    journalArticles: '期刊论文',
    inPress: '即将出版',
    accepted: '有条件接收',
    underReview: '审稿中',
    workingPapers: '工作论文',
    presentations: '学术会议',
    paper: '全文',
    pdf: 'PDF',
    abstract: '摘要',
    cite: '引用',
    copy: '复制',
    copied: '已复制',
    keywords: '关键词',
    correspondingNote: '# 通讯作者',
    downloadCv: '下载简历（PDF）',
    travel: '旅行',
    shows: '演出',
    travelIntro: '地点、片段，以及流动的记忆。',
    showsIntro: '演唱会、舞台、声音与夜晚。',
    places: '个地方',
    nights: '场演出',
    close: '关闭',
    onThisPage: '本页目录',
    scrollDown: '向下查看简介',
    enlargeFigure: '放大图片',
    lastUpdated: '最后更新',
    notFound: '页面不存在',
    notFoundBody: '你要找的页面已移动或不存在。',
    backHome: '返回首页',
    email: '邮箱',
    invited: '特邀报告',
    poster: '海报',
    panel: '圆桌',
    presentation: '会议报告',
  },
} satisfies Record<Lang, Record<string, string>>;

export type StringKey = keyof (typeof strings)['en'];

export function t(lang: Lang, key: StringKey): string {
  return strings[lang][key];
}

/** Chinese value when viewing in Chinese and one was given, otherwise the English value. */
export function pick<T>(lang: Lang, en: T, zh?: T | null): T {
  return lang === 'zh' && zh ? zh : en;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh' : 'en';
}

export function langPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}
