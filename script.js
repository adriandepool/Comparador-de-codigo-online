const { useState, useEffect, useRef, useCallback, useMemo } = React;

// --- ADAPTADOR DE ICONOS LUCIDE (ROBUSTO) ---
const createIcon = (name) => (props) => {
    const lucide = window.lucide;
    if (!lucide || !lucide.icons || !lucide.icons[name]) {
        return React.createElement('span', { style: { width: props.size || 24, height: props.size || 24, display: 'inline-block' } });
    }
    
    const iconDef = lucide.icons[name];
    if (!Array.isArray(iconDef)) return null;

    const tag = iconDef[0];
    const attrs = iconDef[1] || {};
    const children = Array.isArray(iconDef[2]) ? iconDef[2] : [];

    const toCamel = (s) => s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    const reactAttrs = Object.keys(attrs).reduce((acc, key) => {
        acc[toCamel(key)] = attrs[key];
        return acc;
    }, {});

    const mergedProps = {
        ...reactAttrs,
        ...props,
        className: `${reactAttrs.className || ''} ${props.className || ''}`.trim(),
        width: props.size || reactAttrs.width || 24,
        height: props.size || reactAttrs.height || 24,
        stroke: props.color || reactAttrs.stroke || "currentColor",
        strokeWidth: props.strokeWidth || reactAttrs.strokeWidth || 2
    };

    return React.createElement(
        tag,
        mergedProps,
        children.map((child, index) => {
            if (!Array.isArray(child)) return null;
            const childTag = child[0];
            const childAttrs = child[1] || {};
            return React.createElement(childTag, {
                key: index,
                ...Object.keys(childAttrs).reduce((acc, key) => {
                    acc[toCamel(key)] = childAttrs[key];
                    return acc;
                }, {})
            });
        })
    );
};

// Iconos
const Code = createIcon('Code');
const FileDiff = createIcon('FileDiff');
const ArrowRightLeft = createIcon('ArrowRightLeft');
const Copy = createIcon('Copy');
const Trash2 = createIcon('Trash2');
const RotateCcw = createIcon('RotateCcw');
const Check = createIcon('Check');
const Loader2 = createIcon('Loader2');
const Upload = createIcon('Upload');
const FileText = createIcon('FileText');
const AlertTriangle = createIcon('AlertTriangle');
const Play = createIcon('Play');
const ChevronDown = createIcon('ChevronDown');
const ChevronUp = createIcon('ChevronUp');
const Link2 = createIcon('Link2');
const Link2Off = createIcon('Link2Off');
const Columns = createIcon('Columns');
const RectangleHorizontal = createIcon('RectangleHorizontal');
const ArrowLeft = createIcon('ArrowLeft');
const X = createIcon('X');
const Download = createIcon('Download');
const ArrowUpDown = createIcon('ArrowUpDown');
const Undo2 = createIcon('Undo2');

// --- COMPONENTES ---

const EditorPanel = ({ code, onChange, placeholder, title, fileInputRef, onFileUpload, isDragging, onDragOver, onDragLeave, onDrop, scrollRef, onScroll, readOnly = false }) => {
    const lineCount = code.split('\n').length;
    const linesContainerRef = useRef(null);

    const handleLocalScroll = (e) => {
        if (linesContainerRef.current) linesContainerRef.current.scrollTop = e.target.scrollTop;
        if (onScroll) onScroll(e);
    };

    return (
        <div className={`flex flex-col h-full bg-slate-950 relative group border-r border-slate-800 last:border-r-0 ${isDragging ? 'bg-blue-900/20' : ''}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase flex justify-between items-center flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <span>{title}</span>
                    {!readOnly && (
                        <React.Fragment>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={onFileUpload} />
                            <button onClick={() => fileInputRef.current?.click()} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition-colors" title="Cargar Archivo">
                                <Upload className="w-3 h-3" />
                            </button>
                        </React.Fragment>
                    )}
                </div>
                <span className="text-slate-600 font-mono">{code.length} chars</span>
            </div>
            <div className="relative flex-1 overflow-hidden">
                <div ref={linesContainerRef} className="absolute top-0 left-0 bottom-0 w-12 bg-slate-900/30 border-r border-slate-800/50 text-slate-600 text-sm font-mono leading-6 select-none overflow-hidden z-10 pt-4 text-right pr-3">
                    {Array.from({ length: Math.max(1, lineCount) }, (_, i) => <div key={i}>{i + 1}</div>)}
                    <div className="h-8"></div> 
                </div>
                <textarea ref={scrollRef} onScroll={handleLocalScroll} className="absolute inset-0 w-full h-full bg-transparent text-sm font-mono leading-6 p-4 pl-14 resize-none outline-none text-slate-300 placeholder-slate-700 whitespace-pre scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent z-10" placeholder={placeholder} value={code} onChange={(e) => onChange(e.target.value)} spellCheck="false" readOnly={readOnly} />
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-blue-600/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-blue-500 m-4 rounded-xl pointer-events-none">
                        <div className="text-blue-400 flex flex-col items-center"><Upload className="w-10 h-10 mb-2" /><span className="font-bold">Suelta el archivo aquí</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SplitRow = ({ left, right, index, isFocused, onAcceptChange }) => {
    const leftClass = left?.type === 'removed' ? 'bg-red-900/20 text-red-200' : left?.type === 'empty' ? 'bg-slate-950/50' : '';
    const rightClass = right?.type === 'added' ? 'bg-green-900/20 text-green-200' : right?.type === 'empty' ? 'bg-slate-950/50' : '';
    const focusClass = isFocused ? 'ring-1 ring-blue-500 z-10 relative' : '';

    return (
        <div id={`diff-row-${index}`} className={`grid grid-cols-2 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group/row ${focusClass}`}>
            <div className={`flex font-mono text-sm leading-6 relative group/cell ${leftClass}`}>
                <span className="w-12 flex-shrink-0 text-right pr-3 text-slate-600 select-none border-r border-slate-800/30 bg-slate-900/20 py-0.5">{left?.lineNumber || ''}</span>
                <span className="pl-2 pr-2 py-0.5 whitespace-pre-wrap break-all w-full relative">
                    {left?.value || ''}
                    {left?.isStartOfPart && left?.type === 'removed' && (
                        <button onClick={(e) => { e.stopPropagation(); onAcceptChange(left.partIndex, 'remove'); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white border border-slate-600 hover:border-red-500 p-1 rounded shadow-lg z-50 opacity-0 group-hover/row:opacity-100 transition-all duration-100 flex items-center gap-1 text-xs cursor-pointer active:scale-95" title="Borrar del original">
                            <X size={12} /> Borrar
                        </button>
                    )}
                </span>
            </div>
            <div className={`flex font-mono text-sm leading-6 relative group/cell ${rightClass}`}>
                {right?.isStartOfPart && right?.type === 'added' && (
                    <button onClick={(e) => { e.stopPropagation(); onAcceptChange(right.partIndex, 'add', right.pairedIndex); }} className="absolute -left-3 top-1/2 -translate-y-1/2 bg-slate-800 text-green-400 hover:bg-green-600 hover:text-white border border-slate-600 hover:border-green-500 p-1.5 rounded-full shadow-lg z-50 opacity-0 group-hover/row:opacity-100 transition-all duration-100 cursor-pointer active:scale-95 transform hover:scale-110" title="Pasar al Original (Sobreescribir)">
                        <ArrowLeft size={14} />
                    </button>
                )}
                <span className="w-12 flex-shrink-0 text-right pr-3 text-slate-600 select-none border-r border-slate-800/30 bg-slate-900/20 py-0.5">{right?.lineNumber || ''}</span>
                <span className="pl-2 pr-2 py-0.5 whitespace-pre-wrap break-all w-full">{right?.value || ''}</span>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---

function App() {
    const [originalCode, setOriginalCode] = useState('');
    const [modifiedCode, setModifiedCode] = useState('');
    const [history, setHistory] = useState([]);
    
    const [debouncedOriginal, setDebouncedOriginal] = useState('');
    const [debouncedModified, setDebouncedModified] = useState('');
    
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedOriginal(originalCode), 800);
        return () => clearTimeout(handler);
    }, [originalCode]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedModified(modifiedCode), 800);
        return () => clearTimeout(handler);
    }, [modifiedCode]);

    const [diffResult, setDiffResult] = useState([]);
    const [mode, setMode] = useState('edit'); 
    const [diffType, setDiffType] = useState('lines'); 
    const [viewMode, setViewMode] = useState('split'); 
    const [stats, setStats] = useState({ additions: 0, deletions: 0 });
    const [copied, setCopied] = useState(false);
    
    const [isDraggingOverA, setIsDraggingOverA] = useState(false);
    const [isDraggingOverB, setIsDraggingOverB] = useState(false);
    const [isComputing, setIsComputing] = useState(false);
    const [autoCompare, setAutoCompare] = useState(true);
    const [fileSizeWarning, setFileSizeWarning] = useState(false);
    const [syncScroll, setSyncScroll] = useState(true);
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [currentChangeIndex, setCurrentChangeIndex] = useState(-1);
    const [navigableIndices, setNavigableIndices] = useState([]);

    const fileInputARef = useRef(null);
    const fileInputBRef = useRef(null);
    const editorARef = useRef(null);
    const editorBRef = useRef(null);
    const isScrolling = useRef(false);

    useEffect(() => {
        const totalSize = originalCode.length + modifiedCode.length;
        if (totalSize > 50000) {
            if (autoCompare) setAutoCompare(false);
            setDiffType('lines');
            setFileSizeWarning(true);
        } else {
            setFileSizeWarning(false);
        }
    }, [originalCode, modifiedCode]);

    useEffect(() => {
        setCurrentChangeIndex(-1);
    }, [diffResult]);

    const handleScroll = (source) => {
        if (!syncScroll || mode !== 'edit') return;
        if (isScrolling.current) return;
        isScrolling.current = true;
        const sourceEl = source === 'A' ? editorARef.current : editorBRef.current;
        const targetEl = source === 'A' ? editorBRef.current : editorARef.current;
        if (sourceEl && targetEl) {
            targetEl.scrollTop = sourceEl.scrollTop;
            targetEl.scrollLeft = sourceEl.scrollLeft;
        }
        setTimeout(() => { isScrolling.current = false; }, 10);
    };

    const handleFileUpload = (e, targetSide) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (targetSide === 'A') setOriginalCode(content); else setModifiedCode(content);
        };
        reader.readAsText(file);
    };

    const handleDrop = (e, targetSide) => {
        e.preventDefault();
        if (targetSide === 'A') setIsDraggingOverA(false); else setIsDraggingOverB(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                if (targetSide === 'A') setOriginalCode(content); else setModifiedCode(content);
            };
            reader.readAsText(file);
        }
    };

    const calculateDiff = useCallback((textAOverride, textBOverride) => {
        if (!window.Diff) return;
        const textA = textAOverride !== undefined ? textAOverride : debouncedOriginal;
        const textB = textBOverride !== undefined ? textBOverride : debouncedModified;
        setIsComputing(true);
        setTimeout(() => {
            try {
                let diff;
                const effectiveDiffType = (textA.length + textB.length > 500000) ? 'lines' : diffType;
                const options = { ignoreWhitespace: ignoreWhitespace, newlineIsToken: false };
                if (effectiveDiffType === 'chars') diff = window.Diff.diffChars(textA, textB, options);
                else if (effectiveDiffType === 'words') diff = window.Diff.diffWords(textA, textB, options);
                else diff = window.Diff.diffLines(textA, textB, options);
                setDiffResult(diff);
                let adds = 0, dels = 0;
                diff.forEach(part => {
                    if (part.added) adds += part.count || 1;
                    if (part.removed) dels += part.count || 1;
                });
                setStats({ additions: adds, deletions: dels });
            } catch (error) {
                console.error("Error calculando diff:", error);
            } finally {
                setIsComputing(false);
            }
        }, 10);
    }, [debouncedOriginal, debouncedModified, diffType, ignoreWhitespace]);

    useEffect(() => {
        if (autoCompare) calculateDiff();
    }, [debouncedOriginal, debouncedModified, diffType, autoCompare, calculateDiff, ignoreWhitespace]);

    const handleSwap = () => {
        const temp = originalCode;
        setOriginalCode(modifiedCode);
        setModifiedCode(temp);
        setDebouncedOriginal(modifiedCode);
        setDebouncedModified(temp);
        calculateDiff(modifiedCode, temp);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([originalCode], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "codigo_fusionado.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setHistory(history.slice(0, -1));
        setOriginalCode(previous);
        setDebouncedOriginal(previous);
        calculateDiff(previous, debouncedModified);
    };

    const handleAcceptChange = (partIndex, action, pairedIndex = null) => {
        if (!diffResult || partIndex < 0 || partIndex >= diffResult.length) return;
        setHistory(prev => [...prev.slice(-10), originalCode]);
        const partsToSkip = new Set();
        if (pairedIndex !== null) partsToSkip.add(pairedIndex);
        else if (action === 'add') {
            let j = partIndex - 1;
            while (j >= 0 && diffResult[j].removed) { partsToSkip.add(j); j--; }
        }
        let newOriginal = '';
        diffResult.forEach((part, i) => {
            if (i === partIndex) { if (action === 'add') newOriginal += part.value; return; }
            if (partsToSkip.has(i)) return;
            if (!part.added) newOriginal += part.value;
        });
        setOriginalCode(newOriginal);
        setDebouncedOriginal(newOriginal);
        calculateDiff(newOriginal, debouncedModified);
    };

    const splitRows = useMemo(() => {
        if (viewMode !== 'split' || diffResult.length === 0) return [];
        const rows = [];
        let leftLine = 1, rightLine = 1, i = 0;
        while (i < diffResult.length) {
            const part = diffResult[i];
            const partIndex = i;
            if (!part.added && !part.removed) {
                const lines = part.value.replace(/\n$/, '').split('\n');
                lines.forEach(line => {
                    rows.push({ left: { value: line, lineNumber: leftLine++, type: 'unchanged', partIndex }, right: { value: line, lineNumber: rightLine++, type: 'unchanged', partIndex } });
                });
                i++;
            } else {
                const nextPart = diffResult[i + 1];
                if (part.removed && nextPart && nextPart.added) {
                    const remLines = part.value.replace(/\n$/, '').split('\n');
                    const addLines = nextPart.value.replace(/\n$/, '').split('\n');
                    const maxCount = Math.max(remLines.length, addLines.length);
                    for (let j = 0; j < maxCount; j++) {
                        rows.push({
                            left: remLines[j] !== undefined ? { value: remLines[j], lineNumber: leftLine++, type: 'removed', partIndex, isStartOfPart: j === 0 } : { value: '', type: 'empty' },
                            right: addLines[j] !== undefined ? { value: addLines[j], lineNumber: rightLine++, type: 'added', partIndex: i+1, pairedIndex: i, isStartOfPart: j === 0 } : { value: '', type: 'empty' }
                        });
                    }
                    i += 2;
                } else if (part.removed) {
                    const lines = part.value.replace(/\n$/, '').split('\n');
                    lines.forEach((line, j) => rows.push({ left: { value: line, lineNumber: leftLine++, type: 'removed', partIndex, isStartOfPart: j === 0 }, right: { value: '', type: 'empty' } }));
                    i++;
                } else if (part.added) {
                    const lines = part.value.replace(/\n$/, '').split('\n');
                    lines.forEach((line, j) => rows.push({ left: { value: '', type: 'empty' }, right: { value: line, lineNumber: rightLine++, type: 'added', partIndex, isStartOfPart: j === 0 } }));
                    i++;
                }
            }
        }
        return rows;
    }, [diffResult, viewMode]);

    useEffect(() => {
        if (viewMode === 'split') {
            const blockIndices = [];
            splitRows.forEach((row, idx) => {
                if ((row.left.type === 'removed' && row.left.isStartOfPart) || (row.right.type === 'added' && row.right.isStartOfPart)) blockIndices.push(idx);
            });
            setNavigableIndices(blockIndices);
        } else {
            const indices = diffResult.map((part, index) => (part.added || part.removed ? index : -1)).filter(index => index !== -1);
            setNavigableIndices(indices);
        }
    }, [splitRows, diffResult, viewMode]);

    const navigateDiff = (direction) => {
        if (navigableIndices.length === 0) return;
        let newIndex = currentChangeIndex + direction;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= navigableIndices.length) newIndex = navigableIndices.length - 1;
        if (currentChangeIndex === -1 && direction === -1) newIndex = navigableIndices.length - 1;
        setCurrentChangeIndex(newIndex);
        const targetId = viewMode === 'split' ? `diff-row-${navigableIndices[newIndex]}` : `diff-part-${navigableIndices[newIndex]}`;
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const loadExample = () => {
        setOriginalCode(`function calcular(a, b) {\n  return a + b;\n}\n\n// Funcion vieja\nfunction test() {\n  console.log("hola");\n}`);
        setModifiedCode(`function calcular(a, b) {\n  // Suma optimizada\n  return a + b + 0;\n}\n\n// Funcion nueva\nfunction test() {\n  console.info("mundo");\n}`);
        setAutoCompare(true);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-2 shadow-lg z-30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50"><ArrowRightLeft className="w-5 h-5 text-white" /></div>
                        <div><h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Comparador de Código Online</h1><p className="text-xs text-slate-400 hidden sm:block">Herramienta gratuita para comparar textos, detectar diferencias (diff) y fusionar cambios online.</p></div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setMode('edit')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'edit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}><Code className="w-4 h-4" /> Editor</button>
                        <button onClick={() => { setMode('diff'); if (!autoCompare) calculateDiff(); }} disabled={!window.Diff || isComputing} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'diff' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50'}`}>{isComputing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDiff className="w-4 h-4" />} Comparar</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSwap} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors" title="Intercambiar"><ArrowUpDown className="w-4 h-4 rotate-90" /></button>
                        <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-md transition-colors" title="Descargar"><Download className="w-4 h-4" /></button>
                        <div className="h-5 w-px bg-slate-800 mx-1"></div>
                        <button onClick={loadExample} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md" title="Ejemplo"><RotateCcw className="w-4 h-4" /></button>
                        <button onClick={() => { if(confirm('¿Borrar todo?')){setOriginalCode(''); setModifiedCode(''); setHistory([]);} }} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md" title="Limpiar"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </header>

            <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-sm min-h-[50px]">
                <div className="flex flex-wrap items-center gap-4">
                    {mode === 'edit' && <button onClick={() => setSyncScroll(!syncScroll)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${syncScroll ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}>{syncScroll ? <Link2 className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />} Sync Scroll</button>}
                    {mode === 'diff' && (
                        <div className="flex items-center gap-2">
                            <div className="flex bg-slate-800 rounded p-0.5 border border-slate-700">
                                <button onClick={() => setViewMode('split')} className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${viewMode === 'split' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><Columns className="w-3 h-3" /> Split</button>
                                <button onClick={() => setViewMode('unified')} className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${viewMode === 'unified' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}><RectangleHorizontal className="w-3 h-3" /> Unified</button>
                            </div>
                            <button onClick={handleUndo} disabled={history.length === 0} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed ml-2"><Undo2 className="w-3 h-3" /> Deshacer</button>
                        </div>
                    )}
                    <div className="h-4 w-px bg-slate-700 mx-2 hidden md:block"></div>
                    <select value={diffType} onChange={(e) => setDiffType(e.target.value)} disabled={!window.Diff || isComputing || (viewMode === 'split')} className="bg-slate-800 border-none rounded px-2 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-50"><option value="lines">Líneas</option><option value="words">Palabras</option><option value="chars">Caracteres</option></select>
                    <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={ignoreWhitespace} onChange={(e) => setIgnoreWhitespace(e.target.checked)} className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-offset-0 focus:ring-0 w-3 h-3" /><span className="text-xs text-slate-400">Ignorar Espacios</span></label>
                </div>
                {mode === 'diff' && <div className="flex gap-4 text-xs"><span className="flex items-center gap-1 text-green-400 font-mono"><span className="text-green-500">+</span>{stats.additions}</span><span className="flex items-center gap-1 text-red-400 font-mono"><span className="text-red-500">-</span>{stats.deletions}</span></div>}
            </div>

            <main className="flex-1 overflow-hidden relative">
                <div className={`absolute inset-0 grid grid-cols-1 md:grid-cols-2 bg-slate-950 transition-opacity duration-300 ${mode === 'edit' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <EditorPanel title="Original (A)" code={originalCode} onChange={setOriginalCode} placeholder="Pega el código original aquí..." fileInputRef={fileInputARef} onFileUpload={(e) => handleFileUpload(e, 'A')} isDragging={isDraggingOverA} onDragOver={(e) => { e.preventDefault(); setIsDraggingOverA(true); }} onDragLeave={() => setIsDraggingOverA(false)} onDrop={(e) => handleDrop(e, 'A')} scrollRef={editorARef} onScroll={() => handleScroll('A')} />
                    <EditorPanel title="Modificado (B)" code={modifiedCode} onChange={setModifiedCode} placeholder="Pega el código modificado aquí..." fileInputRef={fileInputBRef} onFileUpload={(e) => handleFileUpload(e, 'B')} isDragging={isDraggingOverB} onDragOver={(e) => { e.preventDefault(); setIsDraggingOverB(true); }} onDragLeave={() => setIsDraggingOverB(false)} onDrop={(e) => handleDrop(e, 'B')} scrollRef={editorBRef} onScroll={() => handleScroll('B')} />
                </div>
                <div className={`absolute inset-0 bg-slate-950 overflow-auto transition-opacity duration-300 ${mode === 'diff' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <div className="min-h-full pb-32">
                        {diffResult.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                {isComputing ? <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" /> : <FileDiff className="w-12 h-12 mb-4 opacity-20" />}
                                <p>{isComputing ? "Analizando diferencias..." : "No hay contenido para comparar"}</p>
                                {!autoCompare && !isComputing && <button onClick={() => calculateDiff()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Comparar Ahora</button>}
                            </div>
                        ) : (
                            <div className="bg-slate-900 min-h-full">
                                {viewMode === 'split' ? (
                                    <div className="flex flex-col font-mono text-sm">
                                        <div className="grid grid-cols-2 bg-slate-800 text-slate-400 border-b border-slate-700 sticky top-0 z-20 shadow-md"><div className="p-2 text-center text-xs font-bold uppercase tracking-wider">Original</div><div className="p-2 text-center text-xs font-bold uppercase tracking-wider">Modificado</div></div>
                                        {splitRows.map((row, index) => <SplitRow key={index} index={index} left={row.left} right={row.right} isFocused={navigableIndices[currentChangeIndex] === index} onAcceptChange={handleAcceptChange} />)}
                                    </div>
                                ) : (
                                    <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed max-w-6xl mx-auto">
                                        {diffResult.map((part, index) => {
                                            const isFocused = navigableIndices[currentChangeIndex] === index;
                                            const colorStyle = part.added ? 'bg-green-900/30 text-green-200 border-b border-green-500/30' : part.removed ? 'bg-red-900/30 text-red-200 border-b border-red-500/30 line-through decoration-red-500/50 opacity-70' : 'text-slate-400';
                                            const focusStyle = isFocused ? 'ring-2 ring-blue-500 bg-blue-500/10 rounded-sm z-10 relative shadow-[0_0_20px_rgba(59,130,246,0.3)]' : '';
                                            return <span key={index} id={`diff-part-${index}`} className={`${colorStyle} ${focusStyle} transition-all duration-300`}>{part.value}</span>;
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {mode === 'diff' && navigableIndices.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 pl-4 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mr-2 hidden sm:block">{stats.additions + stats.deletions} Cambios</div>
                        <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => navigateDiff(-1)} className="p-2 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"><ChevronUp className="w-5 h-5" /></button>
                            <div className="px-3 min-w-[4rem] text-center font-mono text-sm"><span className="text-white font-bold">{currentChangeIndex >= 0 ? currentChangeIndex + 1 : '-'}</span><span className="text-slate-500 mx-1">/</span><span className="text-slate-400">{navigableIndices.length}</span></div>
                            <button onClick={() => navigateDiff(1)} className="p-2 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"><ChevronDown className="w-5 h-5" /></button>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(viewMode === 'split' ? originalCode : modifiedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="ml-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform active:scale-95" title="Copiar Todo">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                    </div>
                )}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
