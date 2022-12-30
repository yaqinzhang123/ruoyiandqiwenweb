/**
 * 存放一些静态变量、Map 等全局可用的变量
 * @author 小鲤鱼听听
 */
/**
 * 未知文件类型图标
 */
export const unknownImg = require('@/assets/images/file/file_unknown.png')

/**
 * 文件类型图标 Map 映射
 */
export const fileImgMap = new Map([
	['avi', require('@/assets/images/file/file_avi.png')],
	['bat', require('@/assets/images/file/file_powershell.png')],
	['c', require('@/assets/images/file/file_c.png')],
	['c++', require('@/assets/images/file/file_c++.png')],
	['c#', require('@/assets/images/file/file_c#.png')],
	['css', require('@/assets/images/file/file_css.png')],
	['go', require('@/assets/images/file/file_go.png')],
	['py', require('@/assets/images/file/file_python.png')],
	['styl', require('@/assets/images/file/file_stylus.png')],
	['less', require('@/assets/images/file/file_less.png')],
	['conf', require('@/assets/images/file/file_nginx.png')],
	['m', require('@/assets/images/file/file_objective_c.png')],
	['scss', require('@/assets/images/file/file_scss.png')],
	['sass', require('@/assets/images/file/file_sass.png')],
	['csv', require('@/assets/images/file/file_csv.png')],
	['dmg', require('@/assets/images/file/file_dmg.png')],
	['dir', require('@/assets/images/file/dir.png')],
	['doc', require('@/assets/images/file/file_word.svg')],
	['docx', require('@/assets/images/file/file_word.svg')],
	['exe', require('@/assets/images/file/file_exe.png')],
	['html', require('@/assets/images/file/file_html.png')],
	['jar', require('@/assets/images/file/file_jar.png')],
	['java', require('@/assets/images/file/file_java.png')],
	['js', require('@/assets/images/file/file_js.png')],
	['json', require('@/assets/images/file/file_json.png')],
	['jsp', require('@/assets/images/file/file_jsp.png')],
	['kt', require('@/assets/images/file/file_kotlin.png')],
	['mp3', require('@/assets/images/file/file_music.png')],
	['flac', require('@/assets/images/file/file_flac.svg')],
	['oa', require('@/assets/images/file/file_oa.png')],
	['open', require('@/assets/images/file/file_open.png')],
	['pdf', require('@/assets/images/file/file_pdf.png')],
	['php', require('@/assets/images/file/file_php.png')],
	['ppt', require('@/assets/images/file/file_ppt.svg')],
	['pptx', require('@/assets/images/file/file_ppt.svg')],
	['properties', require('@/assets/images/file/file_properties.png')],
	['r', require('@/assets/images/file/file_r.png')],
	['rar', require('@/assets/images/file/file_rar.png')],
	['rs', require('@/assets/images/file/file_rust.png')],
	['rtf', require('@/assets/images/file/file_rtf.png')],
	['sh', require('@/assets/images/file/file_shell.png')],
	['sql', require('@/assets/images/file/file_sql.png')],
	['svg', require('@/assets/images/file/file_svg.png')],
	['swift', require('@/assets/images/file/file_swift.png')],
	['ts', require('@/assets/images/file/file_typescript.png')],
	['txt', require('@/assets/images/file/file_txt.png')],
	['vue', require('@/assets/images/file/file_vue.png')],
	['xls', require('@/assets/images/file/file_excel.svg')],
	['xlsx', require('@/assets/images/file/file_excel.svg')],
	['xml', require('@/assets/images/file/file_xml.png')],
	['zip', require('@/assets/images/file/file_zip.png')],
	['7z', require('@/assets/images/file/file_7z.svg')],
	['tar', require('@/assets/images/file/file_tar.svg')],
	['md', require('@/assets/images/file/file_markdown.png')],
	['markdown', require('@/assets/images/file/file_markdown.png')],
	['yaml', require('@/assets/images/file/file_yaml.png')],
	['yml', require('@/assets/images/file/file_yaml.png')]
])

/**
 * 支持使用 onlyoffice 打开的文件格式
 */
export const officeFileType = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx']

/**
 * markdown 文件后缀
 */
export const markdownFileType = ['markdown', 'md']

/**
 * 文件展示模式选择列表时，所有可供选择的表格列名
 */
export const allColumnList = [
	'extendName',
	'fileSize',
	'uploadTime',
	'deleteTime'
]

/**
 * 可以用代码编辑器打开的文件后缀和 解析语言、 codemirror 解析模式 mode 映射关系
 * language：解析语言,
 * mime: codemirror 解析模式
 */
export const fileSuffixCodeModeMap = new Map([
	['c', { language: 'C', mime: 'text/x-csrc' }],
	['c++', { language: 'C++', mime: 'text/x-c++src' }],
	['c#', { language: 'C#', mime: 'text/x-csharp' }],
	['m', { language: 'Objective-C', mime: 'text/x-objectivec' }],
	['go', { language: 'GO', mime: 'text/x-go' }],
	['kt', { language: 'Kotlin', mime: 'text/x-java' }],
	['css', { language: 'CSS', mime: 'text/css' }],
	['less', { language: 'Less', mime: 'text/x-less' }],
	['php', { language: 'PHP', mime: 'text/x-php' }],
	['bat', { language: 'PowerShell', mime: 'application/x-powershell' }],
	['py', { language: 'Python', mime: 'text/x-python' }],
	['properties', { language: 'Properties', mime: 'text/x-properties' }],
	['R', { language: 'R', mime: 'text/x-rsrc' }],
	['rs', { language: 'Rust', mime: 'text/x-rustsrc' }],
	['scss', { language: 'Scss', mime: 'text/x-scss' }],
	['sass', { language: 'Sass', mime: 'text/x-sass' }],
	['sh', { language: 'Shell', mime: 'text/x-sh' }],
	['styl', { language: 'stylus', mime: 'text/x-styl' }],
	['xml', { language: 'XML', mime: 'text/xml' }],
	['html', { language: 'HTML', mime: 'text/html' }],
	['http', { language: 'HTTP', mime: 'text/http' }],
	['conf', { language: 'Nginx', mime: 'text/x-nginx-conf' }],
	['java', { language: 'Java', mime: 'text/x-java' }],
	['js', { language: 'JavaScript', mime: 'text/javascript' }],
	['ts', { language: 'Typescript', mime: 'text/typescript' }],
	['json', { language: 'JSON', mime: 'application/json' }],
	['jsp', { language: 'JSP', mime: 'application/x-jsp' }],
	['txt', { language: '', mime: '' }],
	['vue', { language: 'HTML', mime: 'text/html' }],
	['sql', { language: 'SQL', mime: 'text/x-sql' }],
	['swift', { language: 'Swift', mime: 'text/x-swift' }],
	['yml', { language: 'YAML', mime: 'text/x-yaml' }]
])

/**
 * codemirror 编辑器代码高亮主题列表
 */
export const codeMirrorThemeList = [
	'3024-day',
	'3024-night',
	'abbott',
	'abcdef',
	'ambiance-mobile',
	'ambiance',
	'ayu-dark',
	'ayu-mirage',
	'base16-dark',
	'base16-light',
	'bespin',
	'blackboard',
	'cobalt',
	'colorforth',
	'darcula',
	'dracula',
	'duotone-dark',
	'duotone-light',
	'eclipse',
	'elegant',
	'erlang-dark',
	'gruvbox-dark',
	'hopscotch',
	'icecoder',
	'idea',
	'isotope',
	'juejin',
	'lesser-dark',
	'liquibyte',
	'lucario',
	'material-darker',
	'material-ocean',
	'material-palenight',
	'material',
	'mbo',
	'mdn-like',
	'midnight',
	'monokai',
	'moxer',
	'neat',
	'neo',
	'night',
	'nord',
	'oceanic-next',
	'panda-syntax',
	'paraiso-dark',
	'paraiso-light',
	'pastel-on-dark',
	'railscasts',
	'rubyblue',
	'seti',
	'shadowfox',
	'solarized',
	'ssms',
	'the-matrix',
	'tomorrow-night',
	'tomorrow-night-bright',
	'tomorrow-night-eighties',
	'ttcn',
	'twilight',
	'vibrant-ink',
	'xq-dark',
	'xq-light',
	'yeti',
	'yonce',
	'zenburn'
]

/**
 * codemirror 编辑器代码字体大小
 */
export const fontSizeList = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
