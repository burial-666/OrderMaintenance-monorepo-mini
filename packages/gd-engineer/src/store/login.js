import { defineStore } from "pinia";
import { ref } from "vue";

const useLoginStore = defineStore("login", () => {
    const token = ref('');
    const id = ref('');
    const role_id = ref('');
    const group_id = ref('');
    const name = ref('');
    const user_id = ref('');
    const phone_number = ref('');
    const status = ref('');
    const setToken = (value) => {
        token.value = value;
    }
    const removeToken = () => {
        token.value = '';
    }
    const setId = (value) => {
        id.value = value;
    }
    const removeId = () => {
        id.value = '';
    }
    const setRoleId = (value) => {
        role_id.value = value;
    }
    const removeRoleId = () => {
        role_id.value = '';
    }
    const setGroupId = (value) => {
        group_id.value = value;
    }
    const removeGroupId = () => {
        group_id.value = '';
    }
    const setName = (value) => {
        name.value = value;
    }
    const removeName = () => {  
        name.value = '';
    }
    const setPhoneNumber = (value) => {
        phone_number.value = value;
    }
    const removePhoneNumber = () => {
        phone_number.value = '';
    }
    const setStatus = (value) => {
        status.value = value;
    }
    const removeStatus = () => {
        status.value = '';
    }
    const setUserId = (value) => {
        user_id.value = value;
    }
    const removeUserId = () => {
        user_id.value = '';
    }
    return{token, setToken, removeToken, id, setId, removeId, role_id, setRoleId, removeRoleId, group_id, setGroupId, removeGroupId, name, setName, removeName, phone_number, setPhoneNumber, removePhoneNumber, status, setStatus, removeStatus, user_id, setUserId, removeUserId} 
},{persist:{
    paths:['token','id','role_id','group_id','name','phone_number','status','user_id']
}})

export default useLoginStore;