<template>
  <div ref="editor"></div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  props: {
    code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "python",
    },
    theme: {
      type: String,
      default: "vs-dark",
    },
    debuggerLineNumber: {
      type: Number,
      default: null,
    },
  },
  watch: {
    code(newVal) {
      if (window.editor) {
        window.editor.setValue(newVal);
      }
    },
    debuggerLineNumber(newVal) {
      if (newVal) {
        this.targetId = this.editorLineHighlight(
          newVal,
          "debuggerContentClass",
          "debuggerGlyphMarginClass",
          this.targetId
        );
      }
    },
  },
  async mounted() {
    // function createDependencyProposals(range) {
    //   // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    //   // here you could do a server side lookup
    //   return [
    //     {
    //       label: "def",
    //       insertText:
    //         'def ${1:function}(${2:args}):\n\t"""docs for  ${1:function}"""',
    //       range: range,
    //       kind: monaco.languages.CompletionItemKind.Snippet,
    //       insertTextRules:
    //         monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //     },
    //     {
    //       label: "range",
    //       insertText: "range()",
    //       range: range,
    //       kind: monaco.languages.CompletionItemKind.Class,
    //       documentation:
    //         "Rather than being a function, range is actually an immutable sequence type, as documented in Ranges and Sequence Types — list, tuple, range.Rather than being a function, range is actually an immutable sequence type, as documented in Ranges and Sequence Types — list, tuple, range.",
    //     },
    //   ];
    // }

    // monaco.languages.registerCompletionItemProvider("python", {
    //   provideCompletionItems: function (model, position) {
    //     var word = model.getWordUntilPosition(position);
    //     var range = {
    //       startLineNumber: position.lineNumber,
    //       endLineNumber: position.lineNumber,
    //       startColumn: word.startColumn,
    //       endColumn: word.endColumn,
    //     };
    //     return {
    //       suggestions: createDependencyProposals(range),
    //     };
    //   },
    // });

    const el = this.$refs.editor;
    window.editor = monaco.editor.create(el, {
      value: this.code,
      language: this.language,
      theme: this.theme,
      wordBasedSuggestions: true,
      quickSuggestions: true,
      glyphMargin: true,
      lightbulb: {
        enabled: true,
      },
    });
    window.editor.onDidChangeModelContent(() => {
      this.$emit("codeChanged", window.editor.getValue());
    });
  },
  data() {
    return {
      targetId: [],
    };
  },
  methods: {
    editorLineHighlight(lineNo, className, marginClassName, targetId) {
      let decoration = window.editor.deltaDecorations(
        [targetId],
        [
          {
            range: new monaco.Range(lineNo, 1, lineNo, 1),
            options: {
              isWholeLine: true,
              className: className,
              glyphMarginClassName: marginClassName,
            },
          },
        ]
      );
      return decoration[0];
    },
  },
};
// reference - https://github.com/microsoft/monaco-editor/issues/2530
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
/* .debuggerGlyphMarginClass {
  background: #f00;
  border-radius: 25px;
  margin-left: 10px;
  height: 10px !important;
  width: 10px !important;
} */
.debuggerContentClass {
  background: #4a5116;
}
</style>
