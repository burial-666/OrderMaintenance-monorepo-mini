import { defineStore } from "pinia";
import { ref } from "vue";

const usePageStore = defineStore("page", ()=>{
    const selectedEngineerID = ref(0);
    const selectedEngineerName = ref("");
    const setSelectedEngineerID = (id) => {
        selectedEngineerID.value = id;
    }
    const setSelectedEngineerName = (name) => {
        selectedEngineerName.value = name;
    }
    return {
        selectedEngineerID,
        setSelectedEngineerID,
        selectedEngineerName,
        setSelectedEngineerName
    }
})

export default usePageStore;