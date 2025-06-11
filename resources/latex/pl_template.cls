\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{myclass}[2024/11/10 Custom document class]

% 引入基础文档类
\LoadClass[12pt]{article}  % 可以选择加载其他标准文档类，如 book 或 report

% 加载 xcolor 包
\RequirePackage[dvipsnames]{xcolor}

% 取消段落缩进
\setlength{\parindent}{0pt}  % 设置段落不缩进

% 确保 paragraph 后的内容不缩进
\def\paragraph{\@startsection{paragraph}{4}{\z@}{1.5ex plus 0.5ex minus 0.5ex}{0.5ex plus 0.5ex}{\normalfont\normalsize\bfseries}}

\setlength{\parskip}{0.5em} % Adds 1em space after each paragraph


% 设置页面布局
\RequirePackage[top=3cm, bottom=2.5cm, left=2.5cm, right=2.5cm, headsep=1.5cm]{geometry}  % 页面边距，headsep 增加页眉与正文之间的间距




% 设置字体
\RequirePackage{times}  % 使用 Times 字体

\RequirePackage{fancyhdr}
\pagestyle{fancy}  % 默认页眉和页脚样式

% 清空默认的页眉和页脚
\fancyhf{}



% 页面内容开始
\newcommand{\startdocument}{
    % 首页使用自定义页眉和页脚
    \firstpageheader  % 设置首页的页眉

    % 生成目录，确保每页使用 otherpagesheader 样式
    \tableofcontents  % 生成目录
}

% 设置标题样式的代码
\RequirePackage{titlesec}

% 设置 section 标题样式 (中央对齐，字号较大)
\titleformat{\section}
  {\normalsize\bfseries\centering}  % 字体大小设置为 Large，加粗且中央对齐
  {CHAPT~\Roman{section}}      % 编号格式为 CHAPT I/II/III
  {0.5em}                        % 标题和编号间距
  {}                           % 标题前不添加其他内容

% 设置 subsection 标题样式 (左对齐，加粗)
\titleformat{\subsection}
  {\normalsize\bfseries}  % 正常大小字体并加粗
  {\thesubsection}        % 标题编号格式如 1.1
  {0.5em}                 % 标题和编号间距
  {}                      % 标题前不添加其他内容

% 设置 subsubsection 标题样式 (左对齐，带下划线)
\titleformat{\subsubsection}
% {\normalsize \underline} % 正常大小字体且带下划线
  {\normalsize}  % 正常大小字体且带下划线
  {\thesubsubsection}      % 标题编号格式如 1.1.1
  {0.5em}                  % 标题和编号间距
  {}                       % 标题前不添加其他内容
  
% 设置 paragraph 标题样式，使其成为 subsubsection 的子标题，并带有编号
\titleformat{\paragraph}[hang] % hang 表示标题后的内容悬挂对齐
  {\normalsize\itshape} % 统一为 \normalsize 并设置为斜体
  {\thesubsubsection.\arabic{paragraph}}
  {0.5em} % 编号格式，依赖于 subsubsection
  {}

% 让 paragraph 带编号
\setcounter{secnumdepth}{4}

% 重置 paragraph 计数器为每个 subsubsection 的子计数器
\makeatletter
\@addtoreset{paragraph}{subsubsection}
\makeatother

% Section 标题间距设置
\titlespacing*{\section}
  {0pt}                           % 左侧缩进
  {1ex plus 0.2ex minus .2ex}  % 标题前的垂直间距
  {1ex plus .2ex}               % 标题后的垂直间距

% Subsection 标题间距设置
\titlespacing*{\subsection}
  {0pt}                           % 左侧缩进
  {1ex plus 0.2ex minus .2ex}  % 标题前的垂直间距
  {1ex plus .2ex}               % 标题后的垂直间距

% Subsubsection 标题间距设置
\titlespacing*{\subsubsection}
  {0pt}                           % 左侧缩进
  {1ex plus 0.2ex minus .2ex}  % 标题前的垂直间距
  {1ex plus .2ex}               % 标题后的垂直间距

\raggedbottom

% 自定义无编号标题的样式
\newcommand{\customtitle}[1]{%
    \vspace{0.5em}  % 设置标题与前文之间的间距
    \noindent\textbf{\normalsize #1}  % 设置标题样式（粗体，大号蓝色字体）
    \vspace{0.5em}  % 设置标题与后文之间的间距
    \addcontentsline{toc}{section}{#1}  % 将标题添加到目录中
}


% 自定义标题样式
\newcommand{\mytitle}[1]{\begin{center}\LARGE \textbf{#1}\end{center}}

% 定义时间
\date{}

% 定义高亮命令
\newcommand{\highlight}[1]{\textcolor{blue}{#1}}

% 自定义列表样式
\RequirePackage{enumitem}
\setlist[itemize,1]{label=--,left=0pt,labelsep=1em}

% 允许处理图像
\RequirePackage{graphicx}

% 引入enumitem包
\RequirePackage{enumitem}

% 设置 itemize 列表样式，使用蓝色圆点
\setlist[itemize,1]{
    label=\textcolor{blue}{\textbullet},   % 蓝色圆点
    font=\normalfont,          % 使用正常字体
    left=0em,                % 左缩进
    labelsep=1em,          % 圆点与文本之间的间距
    itemsep=0em,              % 列表项之间的间距
    topsep=0.25em
}


% 引入 enumitem 包
\RequirePackage{enumitem}

% 自定义 enumerate 列表样式
\setlist[enumerate,1]{
    label=\textcolor{blue}{\alph*}., 
    left=0pt, 
    labelsep=0.5em, 
    itemsep=0em,
    topsep=0.25em
    }  % 一级列表：小写字母
\setlist[enumerate,2]{
    label=\textcolor{blue}{\roman*}., 
    left=1em, 
    labelsep=0.5em, 
    itemsep=0em,
    topsep=0em
    }  % 二级列表：小写罗马数字

% 引入 enumitem 包
\RequirePackage{enumitem}

% 定义自定义列表环境 customlist
\newlist{customlist}{enumerate}{1}  % 定义一级列表，环境名为 customlist
\setlist[customlist,1]{
    label=\textcolor{blue}{\alph*}.,          % 使用小写字母编号
    left=0em,             % 控制整个列表的左缩进
    labelsep=0.5em,         % 控制标签和内容之间的间距
    itemindent=1.5em,       % 设置每个条目的缩进
    listparindent=1.5em,    % 设置段落的缩进
    itemsep=0em,             % 设置条目之间的间距
    topsep=0.25em
}

% 定义自定义 itemize 列表样式 customitemize
\newlist{customitemize}{itemize}{2}  % 创建两级 itemize 列表，环境名为 customitemize

% 一级项目符号样式
\setlist[customitemize,1]{
    label=\textbullet,           % 使用圆点符号
    left=0pt,                    % 一级列表整体左对齐
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=0pt,              % 控制一级项目的缩进
    itemsep=0em,                 % 控制项目之间的间距
    listparindent=1.5em,        % 段落缩进
    topsep=.25em,
}

% 二级项目符号样式
\setlist[customitemize,2]{
    label=$\circ$,                    % 使用短横线符号
    left=1em,                    % 二级列表的缩进量
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=1.5em,            % 二级项目的缩进
    itemsep=0.5em,               % 控制二级项目之间的间距
    listparindent=1.5em,          % 控制段落缩进
    topsep=0em,
}

% 定义自定义 enumerate 列表样式 numlist
\newlist{numlist}{enumerate}{1}  % 创建一级 enumerate 列表，环境名为 customenum

% 一级项目符号样式
\setlist[numlist,1]{
    label=\textcolor{blue}{\arabic*.}\ ,          % 使用数字和括号作为项目符号，例如 "1.)"
    left=0pt,                    % 一级列表整体左对齐
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=0pt,              % 控制一级项目的缩进
    itemsep=0em,                 % 控制项目之间的间距
    listparindent=0em,         % 段落缩进，与项目内容对齐
    align=left,                   % 标签左对齐
    topsep=.5em,
}

% 定义自定义 itemize 列表样式 customitemize
\newlist{bulletpnt}{itemize}{2}  % 创建两级 itemize 列表，环境名为 customitemize

% 一级项目符号样式
\setlist[bulletpnt,1]{
    label=\textcolor{blue}{\textbullet},           % 使用实心圆点符号（•）
    left=0pt,                    % 一级列表整体左对齐
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=0pt,              % 控制一级项目的缩进
    itemsep=0em,                 % 控制项目之间的间距
    listparindent=1.5em,          % 段落缩进
    topsep=.25em,
}

% 定义编号样式的二级项目符号
\newlist{customenumerate1}{enumerate}{1}  % 创建一级 enumerate 列表，环境名为 customenumerate

% 二级编号样式
\setlist[customenumerate1,1]{
    label=\textcolor{blue}{\arabic*)} ,             % 使用阿拉伯数字编号 1), 2) ...
    left=2em,                    % 二级列表的缩进量
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=1.5em,            % 二级项目的缩进
    itemsep=0.5em,               % 控制二级项目之间的间距
    listparindent=1.5em,          % 控制段落缩进
    topsep=0em,
}

\newlist{customitemize2}{itemize}{2}  % 创建两级 itemize 列表，环境名为 customitemize2

% 一级项目符号样式
\setlist[customitemize2,1]{
    label=\textcolor{blue}{\textbullet},           % 使用圆点符号
    left=0pt,                    % 一级列表整体左对齐
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=0pt,              % 控制一级项目的缩进
    itemsep=1em,                 % 控制项目之间的间距
    listparindent=1.5em,          % 段落缩进
    topsep=.25em,
}

% 二级项目符号样式
\setlist[customitemize2,2]{
    label=\textcolor{blue}{$\circ$},                    % 使用短横线符号
    left=2em,                    % 二级列表的缩进量
    labelsep=0.5em,              % 符号与内容之间的间距
    itemindent=1.5em,            % 二级项目的缩进
    itemsep=0em,               % 控制二级项目之间的间距
    listparindent=1.5em,          % 控制段落缩进
    topsep=0em,
}
% 定义公式编号样式
\renewcommand{\theequation}{\thechapter.\arabic{equation}}

% 定义一个新的环境：对照表格
\newenvironment{comparison}[2][2.5cm]
  {\begin{tabbing}
    \hspace{#1} \= \hspace{#1} \= \kill
    \> \textbf{#2} \> \textbf{Description} \+}
  { \- \end{tabbing}}

\RequirePackage{tocloft}

% Define \cftparagraphfont before using it
\newcommand{\cftparagraphfont}{\itshape}  % Defines paragraph font as italic

% Now apply paragraph formatting in the table of contents
\setcounter{tocdepth}{4}  % Display up to paragraph level in TOC

% Modify formatting for section, subsection, etc.
\renewcommand{\cftsecfont}{\bfseries}  % Bold section title
\renewcommand{\cftsecpagefont}{\bfseries}  % Bold section page number
\setlength{\cftsecindent}{0pt}  % No indent for sections
\setlength{\cftsecnumwidth}{1.3em}  % Width for subsection numbers

\renewcommand{\cftsubsecfont}{\bfseries}  % Bold subsection titles
\renewcommand{\cftsubsecpagefont}{\bfseries}  % Bold section page number
\setlength{\cftsubsecindent}{2em}  % Subsection indent
\setlength{\cftsubsecnumwidth}{2em}  % Width for subsection numbers

\renewcommand{\cftsubsubsecfont}{\normalfont}  % Normal font for subsubsection titles
\setlength{\cftsubsubsecindent}{4em}  % Subsubsection indent
\setlength{\cftsubsubsecnumwidth}{2.5em}  % Width for subsubsection numbers

% 如果 paragraph 不存在于目录中，请添加以下自定义代码
\providecommand{\cftparagraphindent}{2em}  % Paragraph indent
\providecommand{\cftparagraphnumwidth}{2.5em}  % Paragraph number width

% Set TOC title format and spacing
\renewcommand{\cfttoctitlefont}{\bfseries}  % Bold TOC title
\renewcommand{\contentsname}{Table of Contents}  % Change TOC title text
\setlength{\cftbeforetoctitleskip}{4pt}  % Vertical space before TOC title
\setlength{\cftaftertoctitleskip}{4pt}  % Vertical space after TOC title

% Set spacing between entries to 20pt
\setlength{\cftbeforesecskip}{4pt}  % Space before section entries
\setlength{\cftbeforesubsecskip}{4pt}  % Space before subsection entries
\setlength{\cftbeforesubsubsecskip}{4pt}  % Space before subsubsection entries
\setlength{\cftbeforeparaskip}{4pt}  % Space before paragraph entries


% for adjustwidth environment
\usepackage[strict]{changepage}

% for formal definitions
\usepackage{framed}
\usepackage[dvipsnames]{xcolor}

% environment derived from framed.sty: see leftbar environment definition
\definecolor{formalshade}{rgb}{0.95,0.95,1}

\newenvironment{formal}{%
  \def\FrameCommand{%
    \hspace{1pt}%
    {\color{gray}\vrule width 2pt}%
    {\color{formalshade}\vrule width 4pt}%
    \colorbox{formalshade}%
  }%
  \MakeFramed{\advance\hsize-\width\FrameRestore}%
  \noindent\hspace{-4.55pt}% disable indenting first paragraph
  \begin{adjustwidth}{}{7pt}%
  \vspace{2pt}\vspace{2pt}%
}
{%
  \vspace{2pt}\end{adjustwidth}\endMakeFramed%
}
