import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)



const state = {
    fileSystem: [{
        name: "main.py",
        content: "print('hello from script')",
        file: "py",
    }, ],
    activeFile: "main.py",
    activeFileContent: "",
    dependencies: [],
}

const getters = {
    getFileSystem: state => state.fileSystem,
    getActiveFile: state => state.activeFile,
    getActiveFileContent: state => {
        let file = state.fileSystem.find(f => f.name === state.activeFile)
        if (file) return file.content
        return ""
    },
    getDependencies: state => state.dependencies
}

const mutations = {
    setFileStorage: (state, payload) => {
        state.fileSystem = payload
    },
    setDependencies: (state, payload) => {
        state.dependencies = payload
    },
    addFileNewFile: (state, payload) => {
        state.fileSystem.push(payload)
    },
    setActiveFile: (state, payload) => {
        state.activeFile = payload
    },
    setActiveFileContent(state, payload) {
        let index = state.fileSystem.findIndex(f => f.name === state.activeFile)
        state.fileSystem[index].content = payload
    },

    addDependency(state, payload) {
        let version = payload.version
        let packageName = payload.packageName
        let index = state.dependencies.findIndex(dep => dep.packageName === packageName)
        if (index !== -1) {
            if (state.dependencies[index].version === version) return
            state.dependencies.splice(index, 1);
        }

        state.dependencies.push({
            version: version,
            packageName: packageName
        })
    }
}

const actions = {
    initFileSystem: ({
        commit
    }, fileSystem) => {
        commit('setFileStorage', fileSystem)
    },
    initPyDependency: ({
        commit
    }, dependencies) => {
        commit('setDependencies', dependencies)
    },
    addFile: ({
        commit
    }, file) => {
        commit('addFileNewFile', file)
    },
    changeActiveFileContent({
        commit
    }, content) {
        commit('setActiveFileContent', content)
        window.localStorage.setItem('fileSystem', JSON.stringify(state.fileSystem))
    },
    changeActiveFile({
        commit
    }, fileName) {
        commit('setActiveFile', fileName)
    },
    addPyDependency({
        commit
    }, payload) {
        commit('addDependency', payload)
    },
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})